export type Tab = 'ride' | 'journey' | 'dash' | 'fare' | 'status';
export type RideSub = 'individual' | 'shared';
export type RideType = RideSub;
export type EventType = 'stop' | 'deviation';
export type TagTone = 'g' | 'a' | 'r';

export interface TrustedContact {
  name: string;
  relation: string;
  phone: string;
}

export interface AuditEntry {
  key: number;
  t: string;
  id: string;
  rule: string;
  st: string;
  cls: TagTone;
}

export interface ChatMessage {
  key: number;
  sender: 'user' | 'ai';
  text: string;
}

export interface TripRecord {
  tripID: string;
  rideType?: string;
  pickupLocation?: string;
  destination?: string;
  alertStatus?: string;
  safetyEvents?: string;
  tripStatus?: string;
}

export interface SimState {
  p: number;
  run: boolean;
  stopped: boolean;
  dev: boolean;
  off: number;
  speed: number;
}

export interface AlertPin {
  key: number;
  x: number;
  y: number;
  label: string;
}

export interface AlertsResponse {
  alerts?: TripRecord[];
}
export interface RideResponse {
  tripID?: string;
}
export interface SafetyResponse {
  aiExplanation?: string;
}
export interface EscalateResponse {
  notified?: boolean;
}
export interface AskResponse {
  answer: string;
}
