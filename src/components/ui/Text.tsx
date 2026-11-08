import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type P = HTMLAttributes<HTMLElement> & { as?: 'div' | 'p' | 'span' };

function make(base: string) {
  return function Text({ as: As = 'div', className, ...props }: P) {
    return <As className={cn(base, className)} {...props} />;
  };
}

export const Title = make('text-[15px] font-semibold');
export const Label = make('text-[12.5px] text-mu');
export const Small = make('text-[11.5px] text-mu');
export const Big = make('text-[30px] font-semibold tracking-[-0.5px]');
export const H2 = make('mb-3 mt-1 text-[19px] font-semibold');
