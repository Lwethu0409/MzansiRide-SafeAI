import { cn } from '../../lib/cn';
import { Icon, type IconName } from './Icon';

interface IconListProps {
  items: string[];
  icon: IconName;
  iconClassName: string;
  strokeWidth?: number;
  className?: string;
}

export function IconList({ items, icon, iconClassName, strokeWidth = 2.2, className }: IconListProps) {
  return (
    <ul className={cn('p-0', className)}>
      {items.map((t) => (
        <li key={t} className="mb-3 flex gap-2.5 text-[13.5px]">
          <Icon name={icon} strokeWidth={strokeWidth} className={cn('mt-px', iconClassName)} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
