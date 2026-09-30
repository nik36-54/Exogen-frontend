import { Activity, type LucideIcon } from 'lucide-react';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export function LiveIndicator({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[.13em] text-[#c4f56a]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f34a] opacity-30" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />
      </span>
      {compact ? 'LIVE' : 'LIVE FEED'}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const classes: Record<RiskLevel, string> = {
    LOW: 'text-[#a1a8ad] bg-[#a1a8ad]/[.08] border-[#a1a8ad]/15',
    MEDIUM: 'text-[#d9b876] bg-[#d9b876]/[.08] border-[#d9b876]/20',
    HIGH: 'text-[#ff7777] bg-[#ff5c5c]/[.08] border-[#ff5c5c]/20',
    CRITICAL: 'text-[#ff5c5c] bg-[#ff5c5c]/[.13] border-[#ff5c5c]/30',
  };
  return <span className={`inline-flex rounded-[4px] border px-1.5 py-[3px] text-[9px] font-semibold tracking-[.1em] ${classes[level]}`}>{level}</span>;
}

export function ConfidenceBadge({ level }: { level: RiskLevel }) {
  const tone = level === 'HIGH' ? 'text-[#b8f34a]' : level === 'MEDIUM' ? 'text-[#d9b876]' : 'text-[#8f979d]';
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[.08em] ${tone}`}><Activity size={11} /> {level} CONFIDENCE</span>;
}

export function FreshnessIndicator({ text = 'Updated 12 sec ago' }: { text?: string }) {
  return <span className="mono text-[10px] text-[#656b70]">{text}</span>;
}

export function MetricCard({
  title, value, secondary, icon: Icon, accent = false, annotation,
}: {
  title: string; value: string; secondary: string; icon: LucideIcon; accent?: boolean; annotation?: string;
}) {
  return (
    <article className="panel group relative min-h-[135px] overflow-hidden px-5 py-[18px] transition-colors duration-200 hover:border-[#343a3d]">
      <div className="mb-[18px] flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[.14em] text-[#8c9499]">{title}</span>
        <Icon size={14} strokeWidth={1.7} className={accent ? 'text-[#b8f34a]' : 'text-[#5f686e]'} />
      </div>
      <div className={`mono text-[30px] leading-none tracking-[-.045em] ${accent ? 'text-[#c7f77c]' : 'text-[#f5f5f2]'}`}>{value}</div>
      <div className="mt-[13px] flex items-center gap-2">
        <span className={`mono text-[11px] ${accent ? 'text-[#b8f34a]' : 'text-[#aab0b4]'}`}>{secondary}</span>
        {annotation && <span className="text-[10px] text-[#656b70]">{annotation}</span>}
      </div>
    </article>
  );
}