import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, ChartNoAxesCombined,
  ChevronRight, Info, Layers3, Shield,
} from 'lucide-react';
import { eventRecords, exposureBreakdown, exposureSeries, type EventRecord, type Timeframe } from '../data/overview';
import { FreshnessIndicator, LiveIndicator, MetricCard, RiskBadge } from '../components/overview/Status';
import { useLocation } from 'wouter';

function SectionHeading({ title, note, action }: { title: string; note?: string; action?: ReactNode }) {
  return <div className="mb-4 flex min-h-[28px] items-end justify-between gap-3">
    <div className="flex min-w-0 items-baseline gap-2.5">
      <h2 className="text-[14px] font-medium tracking-[-.015em] text-[#e7e9e4]">{title}</h2>
      {note && <span className="hidden text-[10px] text-[#687075] sm:inline">{note}</span>}
    </div>
    {action}
  </div>;
}

function PanelHeader({ icon: Icon, title, detail }: { icon: typeof Layers3; title: string; detail?: string }) {
  return <div className="flex items-center gap-2.5">
    <span className="flex h-[25px] w-[25px] items-center justify-center rounded border border-[#293034] bg-[#171a1d]"><Icon size={12} className="text-[#939b9f]" /></span>
    <div><h3 className="text-[11px] font-medium text-[#d9dcd7]">{title}</h3>{detail && <p className="mt-[2px] text-[9px] text-[#646c71]">{detail}</p>}</div>
  </div>;
}

function OverviewHeader() {
  return <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#1d2225] pb-6 md:flex-row md:items-end">
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded border border-[#b8f34a]/20 bg-[#b8f34a]/[.06] px-2 py-1 text-[8px] font-semibold tracking-[.15em] text-[#b8f34a]">EXECUTIVE BRIEFING</span>
        <span className="text-[9px] tracking-[.04em] text-[#60686d]">JPMORGAN CHASE · DEMO DATA</span>
      </div>
      <h1 className="text-[27px] font-medium leading-[1.14] tracking-[-.045em] text-[#f4f5f1] sm:text-[32px]">Good morning.</h1>
      <p className="mt-[7px] text-[12px] text-[#8f979c]">External risk changed overnight.</p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded border border-[#262c2f] bg-[#111416] px-3 py-[9px]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />
        <span className="text-[10px] text-[#aab0b4]">JPMorgan Chase</span>
        <ChevronRight size={12} className="text-[#555e63]" />
        <span className="text-[9px] text-[#767f84]">Enterprise</span>
      </div>
      <div className="flex items-center gap-2"><FreshnessIndicator /><span className="rounded border border-[#282e31] px-1.5 py-1 text-[8px] tracking-[.12em] text-[#687176]">MOCK</span></div>
    </div>
  </div>;
}

function ExposureChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('30D');
  const [hovered, setHovered] = useState<number | null>(null);
  const series = exposureSeries[timeframe];
  const chart = useMemo(() => {
    const min = Math.min(...series.map((point) => point.value)) - 1;
    const max = Math.max(...series.map((point) => point.value)) + 1;
    const points = series.map((point, index) => ({
      ...point,
      x: 44 + (index * 612) / Math.max(series.length - 1, 1),
      y: 132 - ((point.value - min) / (max - min)) * 104,
    }));
    return { points, line: points.map((p) => `${p.x},${p.y}`).join(' '), area: `44,140 ${points.map((p) => `${p.x},${p.y}`).join(' ')} 656,140` };
  }, [series]);
  const activeIndex = hovered ?? series.length - 1;
  const active = chart.points[activeIndex];
  const formatExposure = (n: number) => `$${n.toFixed(1)}M`;
  return <section className="panel p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2"><h2 className="text-[14px] font-medium text-[#e5e7e2]">Potential Exposure</h2><span className="rounded border border-[#292f32] px-1.5 py-[3px] text-[8px] tracking-[.1em] text-[#626b70]">DEMO SERIES</span></div>
        <div className="mt-3 flex items-baseline gap-2.5"><span className="mono text-[27px] tracking-[-.045em] text-[#c6f574]">{formatExposure(active.value)}</span><span className="inline-flex items-center gap-1 text-[10px] text-[#b8f34a]"><ArrowUpRight size={12} /> +12.8%</span></div>
        <p className="mt-1 text-[9px] text-[#687075]">{timeframe} view · company-mapped event exposure</p>
      </div>
      <div role="group" aria-label="Exposure chart timeframe" className="flex rounded-md border border-[#282e31] bg-[#0d1011] p-[3px]">
        {(['24H', '7D', '30D', '90D'] as Timeframe[]).map((range) => <button key={range} type="button" data-testid={`timeframe-${range.toLowerCase()}`} aria-pressed={timeframe === range} onClick={() => { setTimeframe(range); setHovered(null); }} className={`rounded px-[9px] py-[5px] text-[9px] font-medium transition-colors ${timeframe === range ? 'bg-[#242a21] text-[#c6f574]' : 'text-[#788186] hover:text-[#d7dad6]'}`}>{range}</button>)}
      </div>
    </div>
    <div className="relative mt-5">
      {hovered !== null && <div className="pointer-events-none absolute z-10 min-w-[100px] rounded-md border border-[#343b3e] bg-[#191d1f] px-2.5 py-2 shadow-xl" style={{ left: `${Math.min(Math.max((active.x / 700) * 100 - 7, 4), 78)}%`, top: `${Math.max(active.y - 42, 0)}px` }}>
        <div className="mono text-[11px] text-[#c6f574]">{formatExposure(active.value)}</div><div className="mt-1 text-[9px] text-[#858d91]">{active.label}</div>
      </div>}
      <svg viewBox="0 0 700 174" role="img" aria-label={`Potential exposure history for ${timeframe}`} className="block h-[170px] w-full overflow-visible">
        <defs><linearGradient id="exposure-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b8f34a" stopOpacity=".13" /><stop offset="100%" stopColor="#b8f34a" stopOpacity="0" /></linearGradient></defs>
        {[28, 64, 100, 136].map((y) => <line key={y} x1="44" x2="656" y1={y} y2={y} stroke="#242a2d" strokeWidth="1" strokeDasharray="2 5" />)}
        <polygon points={chart.area} fill="url(#exposure-fill)" />
        <polyline points={chart.line} fill="none" stroke="#b8f34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {chart.points.map((point, index) => <g key={point.label} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)} tabIndex={0} role="button" aria-label={`${point.label}: ${formatExposure(point.value)}`}>
          <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
          <circle cx={point.x} cy={point.y} r={activeIndex === index ? 4 : 2.5} fill={activeIndex === index ? '#c6f574' : '#111416'} stroke="#b8f34a" strokeWidth={activeIndex === index ? 2 : 1.5} />
        </g>)}
        {chart.points.map((point, index) => <text key={point.label} x={point.x} y="162" textAnchor={index === 0 ? 'start' : index === chart.points.length - 1 ? 'end' : 'middle'} fill="#687176" fontSize="9" fontFamily="var(--app-font-mono)">{point.label}</text>)}
      </svg>
      <div className="pointer-events-none absolute inset-0" onMouseLeave={() => setHovered(null)} />
    </div>
    <div className="mt-1 flex items-center justify-between border-t border-[#24292c] pt-3 text-[9px] text-[#646d72]"><span className="flex items-center gap-1.5"><span className="h-[2px] w-3 bg-[#b8f34a]" /> JPMorgan Chase mapped exposure</span><span className="mono">USD · SIMULATED</span></div>
  </section>;
}

function WhatChanged({ onSelect }: { onSelect: (event: EventRecord) => void }) {
  return <section>
    <SectionHeading title="What changed" note="External risk movements" action={<button type="button" data-testid="all-changes-button" onClick={() => onSelect(eventRecords[0])} className="flex items-center gap-1 text-[9px] text-[#8d969a] transition-colors hover:text-[#c6f574]">View all <ArrowRight size={11} /></button>} />
    <div className="panel divide-y divide-[#24282c] overflow-hidden">
      {eventRecords.map((event, index) => <button type="button" key={event.id} data-testid={`change-event-${event.id}`} onClick={() => onSelect(event)} className="group relative block w-full px-4 py-[14px] text-left transition-colors hover:bg-[#15191a] sm:px-[17px]">
        <span className={`absolute bottom-0 left-0 top-0 w-[2px] ${index === 0 ? 'bg-[#b8f34a]' : 'bg-transparent group-hover:bg-[#535d62]'}`} />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[#b8f34a]' : 'bg-[#70797e]'}`} /><span className="text-[9px] text-[#7c858a]">{event.age}</span><span className="text-[8px] text-[#4c5459]">·</span><RiskBadge level={event.risk} /></div>
          <span className="mono text-[9px] text-[#596267]">{event.id}</span>
        </div>
        <div className="mt-[9px] flex items-start justify-between gap-2">
          <div><h3 className="text-[11px] font-medium text-[#e5e7e2] group-hover:text-[#f5f5f2]">{event.title}</h3><p className="mt-[3px] text-[9px] text-[#687176]">{event.category}</p></div>
          <ChevronRight size={13} className="mt-1 shrink-0 text-[#535d62] transition-transform group-hover:translate-x-0.5 group-hover:text-[#b8f34a]" />
        </div>
        <div className="mt-[11px] grid grid-cols-2 gap-3 border-t border-[#22272a] pt-[10px]">
          <div><div className="text-[8px] uppercase tracking-[.1em] text-[#687176]">Market probability</div><div className="mono mt-1 text-[10px] text-[#cdd1cc]">{event.previousProbability}<span className="mx-1.5 text-[#50595e]">→</span><span className="text-[#b8f34a]">{event.probability}</span></div></div>
          <div><div className="text-[8px] uppercase tracking-[.1em] text-[#687176]">Potential exposure</div><div className="mono mt-1 text-[10px] text-[#cdd1cc]">{event.previousExposure}<span className="mx-1.5 text-[#50595e]">→</span><span className="text-[#e6e8e3]">{event.exposure}</span></div></div>
        </div>
      </button>)}
    </div>
  </section>;
}

function SignalCard({ record, onSelect }: { record: EventRecord; onSelect: (event: EventRecord) => void }) {
  return <article className="panel group flex min-h-[233px] flex-col p-4 transition-colors duration-200 hover:border-[#394044] sm:p-[18px]">
    <div className="flex items-center justify-between"><LiveIndicator compact /><span className="mono text-[9px] text-[#626b70]">{record.id}</span></div>
    <button type="button" data-testid={`signal-card-${record.id}`} onClick={() => onSelect(record)} className="mt-3 text-left text-[12px] font-medium leading-[1.4] text-[#e7e9e4] transition-colors group-hover:text-[#c6f574]">{record.title}</button>
    <div className="mt-auto">
      <div className="mt-5 grid grid-cols-[1fr_1fr_1.15fr] gap-2 border-b border-[#252a2d] pb-3">
        <div><div className="mono text-[16px] tracking-[-.04em] text-[#f0f1ed]">{record.probability}</div><div className="mt-1 text-[8px] text-[#737c81]">Probability</div></div>
        <div><div className="mono text-[14px] tracking-[-.04em] text-[#bbc2c5]">{record.change30d}</div><div className="mt-1 text-[8px] text-[#737c81]">30D change</div></div>
        <div><div className="mono text-[19px] leading-none tracking-[-.05em] text-[#c6f574]">{record.exposure}</div><div className="mt-1.5 text-[8px] text-[#8b9499]">Potential impact</div></div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-3">
        <div className="flex min-w-0 items-center gap-2"><RiskBadge level={record.risk} /><span className="truncate text-[9px] text-[#8b9499]">{record.category}</span></div>
        <button type="button" data-testid={`view-signal-${record.id}`} onClick={() => onSelect(record)} className="flex shrink-0 items-center gap-1 text-[9px] text-[#9aa2a6] transition-colors hover:text-[#c6f574]">View signal <ArrowRight size={11} /></button>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[8px] tracking-[.06em] text-[#646d72]">{record.sources.map((source, index) => <span key={source}>{index > 0 && <span className="mr-1.5 text-[#41494e]">·</span>}{source}</span>)}</div>
    </div>
  </article>;
}

function ExposureBreakdown() {
  return <section className="panel p-5 sm:p-6">
    <PanelHeader icon={Layers3} title="Exposure by risk" detail="Company-mapped potential exposure" />
    <div className="mt-5 space-y-[15px]">
      {exposureBreakdown.map((item, index) => <div key={item.label}>
        <div className="mb-[6px] flex items-center justify-between"><span className="text-[10px] text-[#aeb4b6]">{item.label}</span><span className={`mono text-[10px] ${index === 0 ? 'text-[#c6f574]' : 'text-[#d9dcda]'}`}>{item.value}</span></div>
        <div className="h-[4px] overflow-hidden rounded-full bg-[#252b2e]"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: item.width, backgroundColor: item.color }} /></div>
      </div>)}
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-[#252a2d] pt-3"><span className="text-[9px] text-[#70797e]">Total mapped exposure</span><span className="mono text-[11px] font-medium text-[#e8eae6]">$18.4M</span></div>
  </section>;
}

type HeatPoint = { record: EventRecord; left: string; top: string; size: number };
const heatPoints: HeatPoint[] = [
  { record: eventRecords[0], left: '73%', top: '24%', size: 16 },
  { record: eventRecords[1], left: '53%', top: '47%', size: 13 },
  { record: eventRecords[2], left: '78%', top: '75%', size: 10 },
];

function RiskHeatmap({ onSelect }: { onSelect: (event: EventRecord) => void }) {
  const [hovered, setHovered] = useState<EventRecord | null>(null);
  return <section className="panel p-5 sm:p-6">
    <div className="flex items-start justify-between gap-2"><PanelHeader icon={Shield} title="Risk exposure" detail="Probability vs. severity · bubble size indicates exposure" /><Info size={13} className="mt-1 shrink-0 text-[#596267]" /></div>
    <div className="relative mt-5 ml-8 h-[178px] border-b border-l border-[#343b3e]">
      <div className="absolute inset-0 grid grid-rows-3 divide-y divide-dashed divide-[#252b2e]">
        {[0, 1, 2].map((line) => <div key={line} />)}
      </div>
      <div className="absolute -left-8 top-[6%] text-[8px] tracking-[.1em] text-[#737c81]">HIGH</div>
      <div className="absolute -left-8 top-[47%] text-[8px] tracking-[.1em] text-[#737c81]">MED</div>
      <div className="absolute -left-8 bottom-[7%] text-[8px] tracking-[.1em] text-[#737c81]">LOW</div>
      <div className="absolute -bottom-[19px] left-0 text-[8px] text-[#737c81]">LOW</div>
      <div className="absolute -bottom-[19px] right-0 text-[8px] text-[#737c81]">HIGH</div>
      {heatPoints.map(({ record, left, top, size }) => <button type="button" key={record.id} data-testid={`heatmap-${record.id}`} onClick={() => onSelect(record)} onMouseEnter={() => setHovered(record)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(record)} onBlur={() => setHovered(null)} aria-label={`${record.title}, ${record.probability} probability, ${record.risk.toLowerCase()} severity, ${record.exposure} potential exposure`} className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#b8f34a]/70 bg-[#b8f34a]/20 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#b8f34a]" style={{ left, top, width: size, height: size }}>
        <span className="h-[4px] w-[4px] rounded-full bg-[#c6f574]" />
      </button>)}
      {hovered && <div className="absolute z-10 min-w-[166px] rounded-md border border-[#353d40] bg-[#191d1f] p-3 shadow-xl" style={{ left: 'auto', right: '3%', top: '4%' }}>
        <div className="text-[10px] font-medium text-[#e3e5e0]">{hovered.title.replace(' Increase', '')}</div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
          <div><div className="text-[8px] text-[#727b80]">Probability</div><div className="mono mt-1 text-[10px] text-[#d7dad6]">{hovered.probability}</div></div>
          <div><div className="text-[8px] text-[#727b80]">Severity</div><div className="mt-1 text-[10px] text-[#d7dad6]">{hovered.risk.toLowerCase().replace(/^./, (c) => c.toUpperCase())}</div></div>
          <div className="col-span-2 border-t border-[#2b3134] pt-2"><div className="text-[8px] text-[#727b80]">Potential exposure</div><div className="mono mt-1 text-[12px] text-[#c6f574]">{hovered.exposure}</div></div>
        </div>
      </div>}
    </div>
    <div className="mt-7 text-center text-[8px] tracking-[.12em] text-[#6d767b]">PROBABILITY</div>
  </section>;
}

export default function Overview() {
  const [, setLocation] = useLocation();
  const openSignal = (event: EventRecord) => setLocation(`/signals/${encodeURIComponent(event.signalId)}`);
  return <div className="page-enter">
    <OverviewHeader />
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="ACTIVE SIGNALS" value="24" secondary="+4 today" icon={Activity} accent />
      <MetricCard title="POTENTIAL EXPOSURE" value="$18.4M" secondary="+12.8%" icon={ArrowUpRight} accent />
      <MetricCard title="HIGH IMPACT" value="7" secondary="↑ 3 today" icon={BellRing} />
      <MetricCard title="CONNECTED RISKS" value="42" secondary="8 newly elevated" icon={ChartNoAxesCombined} />
    </div>

    <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.03fr)_minmax(420px,.97fr)]">
      <WhatChanged onSelect={openSignal} />
      <ExposureChart />
    </div>

    <section className="mb-8">
      <SectionHeading title="Top impact events" note="Ranked by company-mapped dollar exposure" action={<div className="hidden items-center gap-1.5 text-[9px] text-[#7c858a] sm:flex"><ArrowDownRight size={12} className="text-[#b8f34a]" /> Impact first</div>} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">{eventRecords.map((record) => <SignalCard key={record.id} record={record} onSelect={openSignal} />)}</div>
    </section>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
      <ExposureBreakdown />
      <RiskHeatmap onSelect={openSignal} />
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#1e2326] pt-3 text-[9px] text-[#5f686d]">
      <span className="flex items-center gap-1.5"><Info size={11} /> Illustrative scenario data only. Not a forecast, investment recommendation, or measure of actual JPMorgan Chase exposure.</span>
      <span className="mono">DEMO ENVIRONMENT · 09:42:18 UTC</span>
    </div>
  </div>;
}