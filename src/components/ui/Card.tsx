import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3 rounded-[22px] bg-card p-4', className)} {...props} />;
}

export function Row({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex gap-3', className)} {...props} />;
}

export function Between({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between gap-2', className)} {...props} />;
}

/** Icon + heading row at the top of a card (the original `.ico`). */
export function Ico({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-2 flex items-center gap-2 text-ac', className)} {...props} />;
}
