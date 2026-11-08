import { cn } from '../lib/cn';
import type { Tab } from '../types';
import { Icon, type IconName } from './ui/Icon';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'ride', label: 'Ride', icon: 'car' },
  { id: 'journey', label: 'Journey', icon: 'nav' },
  { id: 'dash', label: 'Dashboard', icon: 'act' },
  { id: 'fare', label: 'Fares', icon: 'users' },
  { id: 'status', label: 'Status', icon: 'shield' },
];

interface TabBarProps {
  tab: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ tab, onChange }: TabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="flex border-t border-ln bg-[#111214] px-1.5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2 desk:order-first desk:w-[232px] desk:flex-none desk:flex-col desk:gap-1.5 desk:border-r desk:border-t-0 desk:px-3.5 desk:py-[22px]"
    >
      <div className="mx-1.5 mb-[22px] hidden items-center gap-2.5 text-[16px] font-bold leading-[1.2] desk:flex">
        <span className="flex size-[38px] flex-none items-center justify-center rounded-xl bg-ac text-ink">
          <Icon name="shield" strokeWidth={2.2} />
        </span>
        <span>
          MzansiRide SafeAI
          <small className="mt-0.5 block text-[11px] font-medium text-mu">AWS AI Hackathon 2026</small>
        </span>
      </div>

      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          data-tab={id}
          aria-current={tab === id ? 'page' : 'false'}
          onClick={() => onChange(id)}
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center gap-1 border-0 bg-transparent py-1.5 text-[10.5px] font-semibold text-mu',
            'desk:flex-none desk:flex-row desk:justify-start desk:gap-3 desk:rounded-[14px] desk:px-3.5 desk:py-3 desk:text-[14px]',
            tab === id && 'text-ac desk:bg-[#16241f]',
          )}
        >
          <Icon name={icon} className="size-[22px]" />
          {label}
        </button>
      ))}

      <div className="hidden px-2 text-[11px] text-mu desk:mt-auto desk:block">
        Praesignis x AWS Hackathon. A prototype: it does not prevent crime or replace emergency services.
      </div>
    </nav>
  );
}
