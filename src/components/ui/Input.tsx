import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** No left icon, so use normal left padding (the original `input.plain`). */
  plain?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ plain, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-[14px] border border-ln bg-card2 py-3 pl-[38px] pr-3 text-tx',
        plain && 'pl-3',
        className,
      )}
      {...props}
    />
  );
});

export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative mb-2.5', className)} {...props} />;
}
