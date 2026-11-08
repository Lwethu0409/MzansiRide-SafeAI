import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEY } from '../config';
import { apiRequest } from '../lib/api';
import { shortName } from '../lib/format';
import { useSimulation } from './useSimulation';
import type {
  AlertPin,
  AlertsResponse,
  AskResponse,
  AuditEntry,
  ChatMessage,
  EscalateResponse,
  EventType,
  RideResponse,
  RideSub,
  RideType,
  SafetyResponse,
  Tab,
  TagTone,
  TripRecord,
  TrustedContact,
} from '../types';

const DEFAULT_CONTACT: TrustedContact = {
  name: 'Tumelo Mathenjwa',
  relation: 'Brother',
  phone: '+27 82 123 4567',
};

let keySeq = 0;
const nextKey = () => ++keySeq;

function loadContact(): TrustedContact {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TrustedContact;
  } catch {
    /* fall through to default */
  }
  return DEFAULT_CONTACT;
}

function makeEntry(rule: string, st: string, cls: TagTone): AuditEntry {
  const d = new Date();
  return {
    key: nextKey(),
    t: d.toLocaleTimeString('en-ZA', { hour12: false }) + ' SAST',
    id:
      'ev-' +
      (1000 + Math.floor(Math.random() * 9000)) +
      '-' +
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
    rule,
    st,
    cls,
  };
}

export type TripsPanel = { kind: 'loading' } | { kind: 'connected' } | { kind: 'rows'; rows: TripRecord[] };

export function useMzansiRide() {
  const screenRef = useRef<HTMLElement>(null);

  /* ---------- navigation ---------- */
  const [tab, setTab] = useState<Tab>('ride');
  const [rideSub, setRideSub] = useState<RideSub>('individual');
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  });

  /* ---------- AWS connection ---------- */
  const [awsLive, setAwsLive] = useState<boolean | null>(null);
  const request = useCallback(
    <T,>(path: string, method?: string, body?: unknown) => apiRequest<T>(path, method, body, setAwsLive),
    [],
  );

  /* ---------- status pills ---------- */
  const [status, setStatus] = useState({ text: 'Standard Mode', green: false });
  const [journeyPill, setJourneyPill] = useState({ text: 'Standby', green: false });

  /* ---------- audit + chat ---------- */
  const [audit, setAudit] = useState<AuditEntry[]>(() => [makeEntry('App opened (simulated session)', 'Logged', 'g')]);
  const [chat, setChat] = useState<ChatMessage[]>(() => [
    {
      key: nextKey(),
      sender: 'ai',
      text: 'Hello! I am your safety assistant. Safe Journey Mode will monitor your simulated trip. I can explain alerts and your options. I do not replace emergency services.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  function log(rule: string, st: string, cls: TagTone) {
    const entry = makeEntry(rule, st, cls);
    setAudit((prev) => [entry, ...prev]);
  }
  function addChat(sender: 'user' | 'ai', text: string) {
    const msg: ChatMessage = { key: nextKey(), sender, text };
    setChat((prev) => [...prev, msg]);
  }

  /* ---------- trusted contact ---------- */
  const [trustedContact, setTrustedContact] = useState<TrustedContact>(loadContact);
  const [draft, setDraft] = useState<TrustedContact>(trustedContact);
  const [editingContact, setEditingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState('Standing by');
  const contactRef = useRef(trustedContact);
  contactRef.current = trustedContact;

  function toggleEditContact() {
    setEditingContact((e) => !e);
  }
  function saveContact() {
    const name = draft.name.trim();
    const relation = draft.relation.trim();
    const phone = draft.phone.trim();
    if (!name || !phone) {
      alert('Please fill in both the contact name and phone number.');
      return;
    }
    const next = { name, relation, phone };
    setTrustedContact(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: keep in memory only */
    }
    setDraft(next);
    toggleEditContact();
    log('Trusted contact updated: ' + name, 'Logged', 'g');
  }

  /* ---------- locations ---------- */
  const [pickup, setPickup] = useState('Sandton City, Johannesburg');
  const [dest, setDest] = useState('Rosebank Mall, Johannesburg');
  const [journeyLocs, setJourneyLocs] = useState({
    pickup: 'Sandton City, Johannesburg',
    dest: 'Rosebank Mall, Johannesburg',
  });
  const [labels, setLabels] = useState({ a: 'Sandton City', b: 'Rosebank Mall' });
  const [locMsg, setLocMsg] = useState({
    text: 'Type a place or pick one from the list. It appears on the map.',
    error: false,
  });
  const valuesRef = useRef({ pickup, dest });
  valuesRef.current = { pickup, dest };

  function updateLocations(rawPickup: string, rawDest: string) {
    const p = rawPickup.trim();
    const d = rawDest.trim();
    if (p.length < 3 || d.length < 3) {
      setLocMsg({ text: 'Please enter both a pickup and a destination.', error: true });
      return false;
    }
    if (p.toLowerCase() === d.toLowerCase()) {
      setLocMsg({ text: 'Pickup and destination are the same. Please change one.', error: true });
      return false;
    }
    setLabels({ a: shortName(p, 14), b: shortName(d, 12) });
    setJourneyLocs({ pickup: p, dest: d });
    setLocMsg({ text: 'Locations added to the sample map.', error: false });
    return true;
  }

  /* ---------- simulation + alert pins ---------- */
  const [pins, setPins] = useState<AlertPin[]>([]);
  const { sim, curXY, registerMap } = useSimulation(() => {
    setJourneyPill({ text: 'Arrived (simulated)', green: true });
    log('Trip completed (simulated)', 'Logged', 'g');
  });

  function dropAlertPin(type: EventType) {
    const xy = curXY.current;
    if (!xy) return;
    const pin: AlertPin = {
      key: nextKey(),
      x: Number(xy[0].toFixed(1)),
      y: Number(xy[1].toFixed(1)),
      label: type === 'stop' ? 'Stop alert' : 'Deviation alert',
    };
    setPins((prev) => [...prev, pin]);
  }

  /* ---------- dashboard ---------- */
  const [metrics, setMetrics] = useState({ total: '--', active: '--' });
  const [trips, setTrips] = useState<TripsPanel>({ kind: 'loading' });

  async function loadLiveMetrics() {
    const data = await request<AlertsResponse>('/alerts');
    if (!data) {
      setMetrics({ total: 'Live AWS', active: 'Online' });
      setTrips({ kind: 'connected' });
      return;
    }
    const rows = data.alerts || [];
    setMetrics({
      total: String(rows.length),
      active: String(rows.filter((r) => r.tripStatus === 'IN_TRANSIT').length || '1'),
    });
    setTrips({ kind: 'rows', rows });
  }

  /* ---------- tabs ---------- */
  function switchTab(id: Tab) {
    setTab(id);
    if (screenRef.current) screenRef.current.scrollTop = 0;
    if (id === 'dash') void loadLiveMetrics();
  }

  /* ---------- safe journey flow ---------- */
  const tripIdRef = useRef('T' + String(Date.now()).slice(-5));
  const timerRef = useRef<number | null>(null);
  const timeLeftRef = useRef(120);
  const [timeLeft, setTimeLeft] = useState(120);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Safety alert: unexpected stop detected');
  const [escalated, setEscalated] = useState<{ title: string; text: string } | null>(null);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  useEffect(() => clearTimer, []);

  async function startJourney(rideType: RideType = 'individual') {
    const { pickup: p, dest: d } = valuesRef.current;
    setJourneyLocs({ pickup: p, dest: d });
    setStatus({ text: rideType === 'shared' ? 'Shared Ride Active' : 'Safe Journey Active', green: true });
    setJourneyPill({ text: rideType === 'shared' ? 'Shared In transit' : 'In transit', green: true });
    Object.assign(sim.current, { p: 0, run: true, stopped: false, dev: false });

    const response = await request<RideResponse>('/ride', 'POST', {
      action: 'request_ride',
      passengerName: 'Siyabonga',
      pickupLocation: p,
      destination: d,
      rideType,
      trustedContact: contactRef.current,
    });

    if (response && response.tripID) {
      tripIdRef.current = response.tripID;
      console.log('Synced active tripID:', response.tripID);
    }

    log(`Safe Journey Mode initialised (${rideType} ride)`, 'Logged', 'g');
    switchTab('journey');
  }

  async function escalate(reason: string) {
    clearTimer();
    setCountdownVisible(false);

    const r = await request<EscalateResponse>('/escalate', 'POST', {
      action: 'escalate',
      tripID: tripIdRef.current,
      response: 'help',
      trustedContact: contactRef.current,
      reason,
    });
    const notified = !!(r && r.notified);
    const c = contactRef.current;
    const expired = reason === 'Timer expired';

    setEscalated({
      title: expired ? 'Timer expired, help requested' : 'Help requested',
      text: notified
        ? `Alert dispatched to ${c.name} (${c.phone}). Logged to DynamoDB.`
        : `Simulated alert dispatched to ${c.name}.`,
    });
    setContactStatus(`Sent to ${c.name}`);
    addChat(
      'ai',
      expired
        ? `2-minute timer expired. Alert sent to ${c.name} and logged in DynamoDB.`
        : `Help requested. Notification dispatched to ${c.name}.`,
    );
    log(expired ? `Timer expired, alert sent to ${c.name}` : `Help requested for ${c.name}`, 'Escalated', 'r');
    sim.current.stopped = false;
    sim.current.dev = false;
  }
  const escalateRef = useRef(escalate);
  escalateRef.current = escalate;

  function escalateNow() {
    void escalate('Manual');
  }

  async function triggerEvent(type: EventType) {
    dropAlertPin(type);
    clearTimer();
    timeLeftRef.current = 120;
    setTimeLeft(120);
    setCountdownVisible(true);
    setEscalated(null);
    const title =
      type === 'stop' ? 'Safety alert: unexpected stop detected' : 'Safety alert: route deviation detected';
    setAlertTitle(title);
    sim.current.stopped = type === 'stop';
    sim.current.dev = type === 'deviation';
    log(type === 'stop' ? 'Prolonged stop rule triggered' : 'Route deviation rule triggered', 'Alert', 'a');
    addChat('ai', title + '. A 2-minute check-in timer has started. Please confirm you are safe.');

    timerRef.current = window.setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearTimer();
        void escalateRef.current('Timer expired');
      }
    }, 1000);

    const data = await request<SafetyResponse>('/safety', 'POST', {
      action: 'safety_event',
      tripID: tripIdRef.current,
      eventType: type === 'stop' ? 'stop' : 'deviation',
    });

    if (data && data.aiExplanation) {
      addChat('ai', data.aiExplanation);
    }
  }

  function confirmImOk() {
    clearTimer();
    setCountdownVisible(false);
    sim.current.stopped = false;
    sim.current.dev = false;
    addChat('ai', 'Passenger check-in confirmed: "I am OK". Journey resumed normally. No escalation needed.');
    log('Passenger confirmed OK', 'Resolved', 'g');
  }

  function resetSimulation() {
    clearTimer();
    setCountdownVisible(false);
    setEscalated(null);
    sim.current.stopped = false;
    sim.current.dev = false;
    setContactStatus('Standing by');
    log('Simulation reset', 'Logged', 'g');
  }

  /* ---------- assistant ---------- */
  async function sendChatMessage() {
    const val = chatInput.trim();
    if (!val) return;
    addChat('user', val);
    setChatInput('');
    const data = await request<AskResponse>('/ask', 'POST', { question: val });
    if (data) return addChat('ai', data.answer);
    window.setTimeout(() => {
      const q = val.toLowerCase();
      let reply =
        'I understand. I recommend staying calm and using your support options: confirm you are okay, ask for help, or call SAPS 10111 or 112. This does not replace emergency services.';
      if (q.includes('stop') || q.includes('why'))
        reply =
          'A stop can have normal causes such as traffic. The app asks you to check in so you can confirm you are okay.';
      else if (q.includes('contact'))
        reply = `Your trusted contact (${contactRef.current.name}) would be told if the 2-minute timer ends without a check-in. In this demo that alert is logged to DynamoDB.`;
      else if (q.includes('driver'))
        reply =
          'The app never assumes the driver did anything wrong. Unusual stops and detours often have normal explanations.';
      else if (q.includes('safe') || q.includes('help') || q.includes('police'))
        reply =
          'If you feel unsafe, call SAPS 10111 or 112 now. GBV Command Centre: 0800 428 428. This app does not replace emergency services.';
      addChat('ai', reply);
    }, 700);
  }

  /* ---------- first load ---------- */
  useEffect(() => {
    void loadLiveMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    screenRef,
    greeting,
    tab,
    switchTab,
    rideSub,
    setRideSub,
    awsLive,
    status,
    journeyPill,
    audit,
    chat,
    chatInput,
    setChatInput,
    sendChatMessage,
    trustedContact,
    draft,
    setDraft,
    editingContact,
    toggleEditContact,
    saveContact,
    contactStatus,
    pickup,
    setPickup,
    dest,
    setDest,
    journeyLocs,
    labels,
    locMsg,
    updateLocations,
    pins,
    registerMap,
    metrics,
    trips,
    loadLiveMetrics,
    startJourney,
    triggerEvent,
    confirmImOk,
    escalateNow,
    resetSimulation,
    timeLeft,
    countdownVisible,
    alertTitle,
    escalated,
  };
}

export type MzansiRide = ReturnType<typeof useMzansiRide>;
