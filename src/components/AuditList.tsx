import type { AuditEntry } from '../types';
import { Tag } from './ui/Pill';

export function AuditList({ audit }: { audit: AuditEntry[] }) {
  return (
    <div>
      {audit.map((a) => (
        <div
          key={a.key}
          className="flex justify-between gap-2.5 border-b border-ln py-2.5 text-[12.5px] last:border-0"
        >
          <div>
            <div className="font-mono">
              {a.t} <span className="text-ac">{a.id}</span>
            </div>
            <div>{a.rule}</div>
          </div>
          <Tag tone={a.cls}>{a.st}</Tag>
        </div>
      ))}
    </div>
  );
}
