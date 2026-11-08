import type { MzansiRide } from '../../hooks/useMzansiRide';
import { getStatusLists } from '../../lib/statusData';
import { Between, Card } from '../ui/Card';
import { IconList } from '../ui/IconList';
import { Tag } from '../ui/Pill';
import { H2, Small, Title } from '../ui/Text';

export function StatusView({ app }: { app: MzansiRide }) {
  const { done, simulated, todo } = getStatusLists(app.awsLive);

  return (
    <section
      id="v-status"
      hidden={app.tab !== 'status'}
      className="desk:grid desk:grid-cols-3 desk:items-start desk:gap-[18px] desk:[&>*]:!m-0"
    >
      <H2 className="desk:col-span-full">Prototype status</H2>
      <Small as="p" className="desk:col-span-full">
        What is built, what is simulated and what is still to do. This page changes when the AWS back end is connected.
      </Small>

      <Card>
        <Between>
          <Title as="span">Completed</Title>
          <Tag tone="g">{done.length}</Tag>
        </Between>
        <IconList className="mt-3" items={done} icon="check" iconClassName="text-ac" />
      </Card>

      <Card>
        <Between>
          <Title as="span">Simulated</Title>
          <Tag tone="a">{simulated.length}</Tag>
        </Between>
        <IconList className="mt-3" items={simulated} icon="warn" iconClassName="text-am" />
      </Card>

      <Card>
        <Between>
          <Title as="span">Outstanding</Title>
          <Tag tone="a">{todo.length}</Tag>
        </Between>
        <IconList className="mt-3" items={todo} icon="clock" iconClassName="text-mu" />
      </Card>
    </section>
  );
}
