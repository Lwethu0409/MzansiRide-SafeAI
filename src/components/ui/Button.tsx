import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'red' | 'amber' | 'ghost';

const variants: Record<Variant, string> = {
  primary: 'bg-ac text-ink',
  red: 'bg-rd text-white',
  amber: 'bg-am text-[#2a1a00]',
  ghost: 'bg-card2 text-tx',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-0 p-3.5 text-[15px] font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** A wrapping row of buttons (the original `.btns`). */
export function ButtonRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-3 flex flex-wrap gap-2 [&>button]:min-w-[120px] [&>button]:flex-1 [&>button]:p-[11px] [&>button]:text-[13px]',
        className,
      )}
      {...props}
    />
  );
}
