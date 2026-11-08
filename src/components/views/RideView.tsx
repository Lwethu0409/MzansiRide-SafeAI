import { useEffect, useRef } from 'react';
import type { MzansiRide } from '../../hooks/useMzansiRide';
import { cn } from '../../lib/cn';
import { MapCard } from '../MapCard';
import { VehicleCar } from '../VehicleCar';
import { Button } from '../ui/Button';
import { Between, Card, Ico, Row } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Field, Input } from '../ui/Input';
import { Big, H2, Label, Small, Title } from '../ui/Text';

const PLACES = [
  'Sandton City, Johannesburg',
  'Rosebank Mall, Johannesburg',
  'Melrose Arch, Johannesburg',
  'Maboneng Precinct, Johannesburg',
  'Wits University, Braamfontein',
  'University of Johannesburg, Auckland Park',
  'Maponya Mall, Soweto',
  'Gautrain Park Station, Johannesburg',
  'Mall of Africa, Midrand',
  'Eastgate Mall, Bedfordview',
  'OR Tambo International Airport',
];

export function RideView({ app }: { app: MzansiRide }) {
  const { rideSub, setRideSub, trustedContact, draft, setDraft, editingContact } = app;
  const pickupRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);

  // The map only updates when a value is committed (native `change`: blur, Enter or datalist pick).
  useEffect(() => {
    const p = pickupRef.current;
    const d = destRef.current;
    if (!p || !d) return;
    const onChange = () => app.updateLocations(p.value, d.value);
    p.addEventListener('change', onChange);
    d.addEventListener('change', onChange);
    return () => {
      p.removeEventListener('change', onChange);
      d.removeEventListener('change', onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const smallField = 'p-2 pl-2.5 text-[12px]';

  return (
    <section
      id="v-ride"
      hidden={app.tab !== 'ride'}
      className="desk:grid desk:grid-cols-[minmax(340px,440px)_1fr] desk:items-start desk:gap-[18px] desk:[&>*]:!m-0 desk:[&>*]:col-start-1"
    >
      {/* Ride sub-tabs (Individual vs Shared) */}
      <div className="mb-3 flex w-full gap-2">
        <Button
          variant={rideSub === 'individual' ? 'primary' : 'ghost'}
          className="flex-1 p-2.5 text-[13px]"
          onClick={() => setRideSub('individual')}
        >
          Individual Ride
        </Button>
        <Button
          variant={rideSub === 'shared' ? 'primary' : 'ghost'}
          className="flex-1 p-2.5 text-[13px]"
          onClick={() => setRideSub('shared')}
        >
          Shared Ride
        </Button>
      </div>

      {/* INDIVIDUAL RIDE */}
      <div hidden={rideSub !== 'individual'}>
        <Card className="flex items-center justify-between gap-2">
          <div>
            <Title>Toyota Corolla (White)</Title>
            <Label>ND 492-811 GP</Label>
            <Title className="mt-3">Driver: Sipho Phakathi</Title>
            <Label>
              Sample driver, <span className="text-am">not verified</span>
            </Label>
          </div>
          <VehicleCar />
        </Card>

        <Row>
          <Card className="min-w-0 flex-1 desk:mb-0">
            <Ico>
              <Icon name="clock" />
              <Title className="text-tx" as="span">
                Estimated trip
              </Title>
            </Ico>
            <Big>R 145</Big>
            <Label>28 minutes (Direct)</Label>
          </Card>

          {/* Persistent trusted contact card */}
          <Card className="mb-0 min-w-0 flex-1">
            <Between>
              <Ico className="mb-0">
                <Icon name="users" />
                <Title className="text-tx" as="span">
                  Contact
                </Title>
              </Ico>
              <Button
                variant="ghost"
                className="w-auto px-2 py-0.5 text-[10.5px]"
                onClick={app.toggleEditContact}
              >
                {editingContact ? 'Cancel' : 'Edit'}
              </Button>
            </Between>

            <div className="mt-1.5" hidden={editingContact}>
              <Title className="text-[14px]">{trustedContact.name}</Title>
              <Label className="text-[11px]">
                {trustedContact.relation ? trustedContact.relation + ' • ' : ''}
                <span>{trustedContact.phone}</span>
              </Label>
              <Title className="mt-1 text-[11.5px] text-ac">{app.contactStatus}</Title>
            </div>

            <div className="mt-2" hidden={!editingContact}>
              <Field className="mb-1.5">
                <Input
                  plain
                  placeholder="Name"
                  className={smallField}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </Field>
              <Field className="mb-1.5">
                <Input
                  plain
                  placeholder="Relation"
                  className={smallField}
                  value={draft.relation}
                  onChange={(e) => setDraft({ ...draft, relation: e.target.value })}
                />
              </Field>
              <Field className="mb-2">
                <Input
                  plain
                  placeholder="Phone"
                  className={smallField}
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                />
              </Field>
              <Button className="p-2 text-[12px]" onClick={app.saveContact}>
                Save
              </Button>
            </div>
          </Card>
        </Row>

        <MapCard defaultTag="Sample map, not live GPS" />

        <Card>
          <H2>Where to?</H2>
          <Field>
            <Icon name="pin" className="absolute left-3 top-1/2 -translate-y-1/2 text-ac" />
            <Input
              ref={pickupRef}
              list="places"
              aria-label="Pickup location"
              value={app.pickup}
              onChange={(e) => app.setPickup(e.target.value)}
            />
          </Field>
          <Field>
            <Icon name="pin" className="absolute left-3 top-1/2 -translate-y-1/2 text-ac" />
            <Input
              ref={destRef}
              list="places"
              aria-label="Destination"
              value={app.dest}
              onChange={(e) => app.setDest(e.target.value)}
            />
          </Field>
          <datalist id="places">
            {PLACES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <Small as="p" className={cn('mb-2', app.locMsg.error && 'text-[#ff8a8a]')}>
            {app.locMsg.text}
          </Small>
          <Button onClick={() => void app.startJourney('individual')}>Request individual ride & activate safety</Button>
          <Small as="p" className="mt-2">
            No real booking or payment is made.
          </Small>
        </Card>
      </div>

      {/* SHARED RIDE */}
      <div hidden={rideSub !== 'shared'}>
        <Card className="flex items-center justify-between gap-2 border border-ac">
          <div>
            <Title className="text-ac">MzansiRide Shared Saver</Title>
            <Label>2 passengers, aligned route</Label>
            <Title className="mt-3">Driver: Sipho Phakathi</Title>
            <Label>Toyota Corolla • ND 492-811 GP</Label>
          </div>
          <VehicleCar />
        </Card>

        <Row>
          <Card className="min-w-0 flex-1 border border-ac bg-ac-bg desk:mb-0">
            <Ico>
              <Icon name="users" />
              <Title className="text-ac" as="span">
                Shared Fare
              </Title>
            </Ico>
            <Big className="text-ac">R 88</Big>
            <Label className="text-[#a3e8d2]">
              <b>Save R 57</b> vs Solo (R 145)
            </Label>
          </Card>
          <Card className="min-w-0 flex-1 desk:mb-0">
            <Ico>
              <Icon name="clock" />
              <Title className="text-tx" as="span">
                Trip duration
              </Title>
            </Ico>
            <Big className="mt-1 text-[24px]">32 mins</Big>
            <Label>+4 mins shared detour</Label>
          </Card>
        </Row>

        <MapCard defaultTag="Sample shared route map" />

        <Card>
          <H2>Shared Ride Details</H2>
          <Small as="p" className="mb-3 text-tx">
            You are matched with 1 co-commuter traveling along the same corridor toward your destination.
          </Small>
          <Button onClick={() => void app.startJourney('shared')}>Request shared ride & activate safety</Button>
          <Small as="p" className="mt-2">
            Includes full Safe Journey Mode monitoring.
          </Small>
        </Card>
      </div>
    </section>
  );
}
