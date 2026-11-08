import { useEffect, useRef } from 'react';
import type { MzansiRide } from '../../hooks/useMzansiRide';
import { cn } from '../../lib/cn';
import { MapCard } from '../MapCard';
import { Button, ButtonRow } from '../ui/Button';
import { Between, Card, Ico, Row } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Input } from '../ui/Input';
import { Pill, Tag } from '../ui/Pill';
import { H2, Label, Small, Title } from '../ui/Text';

const alertBase = 'mb-3 rounded-[22px] border-[1.5px] p-4 desk:col-start-2';

export function JourneyView({ app }: { app: MzansiRide }) {
  const { journeyPill, journeyLocs, timeLeft, escalated, awsLive } = app;
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [app.chat]);

  const timer = Math.floor(timeLeft / 60) + ':' + String(timeLeft % 60).padStart(2, '0');

  return (
    <section
      id="v-journey"
      hidden={app.tab !== 'journey'}
      className="desk:grid desk:grid-cols-[1.5fr_1fr] desk:items-start desk:gap-[18px] desk:[&>*]:!m-0"
    >
      <Between className="desk:col-span-full">
        <H2 className="m-0">Safe Journey Mode</H2>
        <Pill tone={journeyPill.green ? 'green' : 'amber'}>{journeyPill.text}</Pill>
      </Between>

      <Row className="my-3 desk:col-span-full">
        <Card className="m-0 min-w-0 flex-1">
          <Label>From</Label>
          <Title>{journeyLocs.pickup}</Title>
        </Card>
        <Card className="m-0 min-w-0 flex-1">
          <Label>Destination</Label>
          <Title>{journeyLocs.dest}</Title>
        </Card>
      </Row>

      <MapCard defaultTag="Sample map, not live GPS" className="desk:col-start-1 desk:row-[3/span_4] desk:self-stretch" />

      <div role="alert" hidden={!app.countdownVisible} className={cn(alertBase, 'border-am bg-am-bg')}>
        <Between>
          <div className="min-w-0">
            <h3 className="mb-1 text-[15px] font-bold">{app.alertTitle}</h3>
            <p className="text-[12.5px] text-[#d8d2c4]">
              Please confirm you are safe within 2 minutes. Otherwise a message to your trusted contact will be
              dispatched and logged.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[30px] font-bold text-am">{timer}</div>
            <Small>auto-trigger</Small>
          </div>
        </Between>
        <ButtonRow>
          <Button onClick={app.confirmImOk}>
            <Icon name="check" strokeWidth={2.4} />I am OK (cancel alert)
          </Button>
          <Button variant="red" onClick={app.escalateNow}>
            <Icon name="phone" />I need help now
          </Button>
        </ButtonRow>
      </div>

      <div role="alert" hidden={!escalated} className={cn(alertBase, 'border-rd bg-rd-bg')}>
        <Ico className="text-rd-tx">
          <Icon name="warn" />
          <h3 className="m-0 text-[15px] font-bold">{escalated?.title ?? 'Help requested'}</h3>
        </Ico>
        <p className="text-[12.5px] text-[#d8d2c4]">{escalated?.text}</p>
      </div>

      <Card className="desk:col-start-2">
        <Between>
          <Title>Demo controls</Title>
          <Tag tone="a">SIMULATED EVENTS</Tag>
        </Between>
        <Small as="p" className="mt-1.5">
          There is no live GPS. These buttons stand in for trip sensors.
        </Small>
        <ButtonRow>
          <Button variant="amber" onClick={() => void app.triggerEvent('stop')}>
            Simulate prolonged stop
          </Button>
          <Button
            variant="ghost"
            className="border border-[#6d4bd1]"
            onClick={() => void app.triggerEvent('deviation')}
          >
            Simulate route deviation
          </Button>
          <Button variant="ghost" onClick={app.resetSimulation}>
            Reset simulation
          </Button>
        </ButtonRow>
      </Card>

      <Card className="desk:col-start-2">
        <Between>
          <Title>Safety assistant</Title>
          <Tag tone={awsLive ? 'g' : 'a'}>{awsLive ? 'Amazon Bedrock' : 'Simulated replies'}</Tag>
        </Between>
        <div
          ref={chatRef}
          aria-live="polite"
          className="my-2.5 flex h-[250px] flex-col gap-2 overflow-y-auto desk:h-[290px]"
        >
          {app.chat.map((m) => (
            <div
              key={m.key}
              className={cn(
                'max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-[9px] text-[13px] leading-[1.45]',
                m.sender === 'user'
                  ? 'self-end rounded-br-[4px] bg-ac text-ink'
                  : 'self-start rounded-bl-[4px] bg-card2',
              )}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            plain
            placeholder="Ask the safety assistant..."
            aria-label="Ask the safety assistant"
            value={app.chatInput}
            onChange={(e) => app.setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void app.sendChatMessage();
            }}
          />
          <Button className="w-12 flex-none p-0" aria-label="Send" onClick={() => void app.sendChatMessage()}>
            <Icon name="send" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
