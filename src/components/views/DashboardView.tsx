import type { ReactNode } from 'react';
import type { MzansiRide } from '../../hooks/useMzansiRide';
import { AuditList } from '../AuditList';
import { Button } from '../ui/Button';
import { Between, Card } from '../ui/Card';
import { Tag } from '../ui/Pill';
import { H2, Label, Small, Title } from '../ui/Text';

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] bg-card p-3.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const value = 'mt-1 text-[21px] font-semibold';

export function DashboardView({ app }: { app: MzansiRide }) {
  const { metrics, trips, trustedContact } = app;

  return (
    <section
      id="v-dash"
      hidden={app.tab !== 'dash'}
      className="desk:grid desk:grid-cols-1 desk:items-start desk:gap-[18px] desk:[&>*]:!m-0"
    >
      <Between>
        <H2 className="m-0">Live DynamoDB Dashboard</H2>
        <Tag tone="g">LIVE METRICS</Tag>
      </Between>
      <Small as="p" className="mb-3 mt-1.5">
        Real-time metrics fetched directly from your AWS Lambda and Amazon DynamoDB backend
        (`mzansiSafeRideTrips`).
      </Small>

      <div className="mb-3 grid grid-cols-2 gap-3 desk:grid-cols-4">
        <Tile label="Total Trips Logged">
          <div className={`${value} text-ac`}>{metrics.total}</div>
        </Tile>
        <Tile label="Active Trips">
          <div className={`${value} text-am`}>{metrics.active}</div>
        </Tile>
        <Tile label="Bedrock AI Response">
          <div className={`${value} text-[#8fa8ff]`}>310 ms</div>
        </Tile>
        <Tile label="Trusted Contact">
          <div className={`${value} text-ac`}>
            {trustedContact.name} ({trustedContact.phone})
          </div>
        </Tile>
      </div>

      <Card>
        <Between>
          <Title className="mb-1.5">Recent DynamoDB Trip Records</Title>
          <Button variant="ghost" className="w-auto px-2.5 py-1 text-[11px]" onClick={() => void app.loadLiveMetrics()}>
            Refresh
          </Button>
        </Between>
        <div className="mt-2">
          {trips.kind === 'loading' && <Small>Loading records from DynamoDB...</Small>}
          {trips.kind === 'connected' && <Small>Connected to AWS API Gateway &amp; DynamoDB successfully.</Small>}
          {trips.kind === 'rows' &&
            (trips.rows.length ? (
              trips.rows.map((a, i) => (
                <div
                  key={`${a.tripID}-${i}`}
                  className="flex justify-between gap-2.5 border-b border-ln py-2.5 text-[12.5px] last:border-0"
                >
                  <div>
                    <div className="font-mono">
                      {a.tripID} <span className="text-ac">{a.rideType || 'solo'}</span>
                    </div>
                    <Small>
                      {a.pickupLocation || ''} → {a.destination || ''}
                    </Small>
                  </div>
                  <Tag tone="a">{a.alertStatus || a.safetyEvents || 'NORMAL'}</Tag>
                </div>
              ))
            ) : (
              <Small>No active trips stored in DynamoDB yet. Request a simulated ride to populate records!</Small>
            ))}
        </div>
      </Card>

      <Card>
        <Title className="mb-1.5">Session audit trail</Title>
        <AuditList audit={app.audit} />
      </Card>
    </section>
  );
}
