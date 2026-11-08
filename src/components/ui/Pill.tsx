import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { TagTone } from '../../types';

interface PillProps {
  tone: 'amber' | 'green';
  dot?: boolean;
  children: ReactNode;
}

export function Pill({ tone, dot, children }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-[11px] py-[5px] text-[11.5px] font-semibold',
        tone === 'amber' ? 'border-am-bd bg-am-bg text-am' : 'border-ac-bd bg-ac-bg text-ac',
      )}
    >
      {dot && <span className={cn('size-[7px] rounded-full bg-current', tone === 'green' && 'animate-pulse-dot')} />}
      {children}
    </span>
  );
}

const tagTones: Record<TagTone, string> = {
  g: 'bg-ac-bg text-ac',
  a: 'bg-am-bg text-am',
  r: 'bg-rd-bg text-rd-tx',
};

export function Tag({ tone, children, className }: { tone: TagTone; children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'self-start whitespace-nowrap rounded-full px-[9px] py-0.5 text-[11px] font-semibold',
        tagTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
