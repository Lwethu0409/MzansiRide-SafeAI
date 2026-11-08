import type { MzansiRide } from '../../hooks/useMzansiRide';
import { cn } from '../../lib/cn';
import { Card } from '../ui/Card';
import { Big, H2, Label, Small, Title } from '../ui/Text';

const opt = 'mb-2.5 flex items-center justify-between rounded-[18px] border-[1.5px] p-3.5';

export function FaresView({ app }: { app: MzansiRide }) {
  return (
    <section
      id="v-fare"
      hidden={app.tab !== 'fare'}
      className="desk:grid desk:grid-cols-2 desk:items-start desk:gap-[18px] desk:[&>*]:!m-0"
    >
      <H2 className="desk:col-span-full">Individual vs shared ride</H2>

      <Card>
        <Small as="p" className="mb-3">
          MzansiRide SafeAI explores shared fares to reduce daily commuting costs. Sample pricing, illustrative only.
        </Small>
        <div className={cn(opt, 'border-transparent bg-card2')}>
          <div>
            <Label>Solo ride (standard)</Label>
            <Title>1 passenger, direct</Title>
          </div>
          <Big className="text-[22px]">R 145</Big>
        </div>
        <div className={cn(opt, 'border-ac bg-ac-bg')}>
          <div>
            <Label className="text-ac">MzansiRide Shared Saver</Label>
            <Title>2 passengers, aligned route</Title>
          </div>
          <div className="text-right">
            <Big className="text-[24px] text-ac">R 88</Big>
            <Small>-39%</Small>
          </div>
        </div>
      </Card>

      <Card>
        <Title className="mb-3">Economic & community impact</Title>
        <ul className="p-0">
          {[
            ['Affordability for commuters:', 'lowers transport costs for students and workers travelling across major hubs.'],
            [
              'Support while sharing:',
              'shared mobility alongside safety check-ins and guidance. It does not guarantee safety.',
            ],
          ].map(([head, body]) => (
            <li key={head} className="mb-3 flex gap-2.5 text-[13.5px]">
              <svg
                className="mt-px size-5 flex-none text-ac"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <use href="#i-check" />
              </svg>
              <span>
                <b>{head}</b> {body}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
