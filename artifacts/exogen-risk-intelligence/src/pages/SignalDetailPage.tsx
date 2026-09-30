import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Building2, ChevronDown, CircleHelp,
  Clock3, FileCheck2, GitBranch, Landmark, Layers3, Link2, Radio, ShieldAlert,
  SlidersHorizontal, Sparkles, TrendingUp, Waves,
} from 'lucide-react';
import type { BusinessUnitExposure, Contract, ImpactDirection, IntelligenceScenario, TransmissionType } from '@/types/intelligence';
import { intelligenceScenarios } from '@/data/intelligence';
import { calculateImpactEstimate, calculateRiskScore, sumExposureUsdM } from '@/lib/intelligence-calculations';
import { DefinitionRow, DetailDrawer, DetailError, DetailSkeleton, SectionHeading, TogglePanel, WhyButton } from '@/components/intelligence/DetailPrimitives';

type Stage = { id: string; label: string; sublabel: string };
type DrawerMode = 'provenance' | 'technical' | 'contract' | null;
type ImpactCase = 'base' | 'downside' | 'severe' | 'expected';

const stages: Stage[] = [
  { id: 'signal', label: 'Signal', sublabel: 'External change' },
  { id: 'contract', label: 'Contract', sublabel: 'Source market' },
  { id: 'event', label: 'Canonical event', sublabel: 'Normalized truth' },
  { id: 'consensus', label: 'Consensus', sublabel: 'Venue synthesis' },
  { id: 'risk', label: 'Risk', sublabel: 'Transmission' },
  { id: 'exposure', label: 'Exposure', sublabel: 'Business units' },
  { id: 'score', label: 'Risk score', sublabel: 'Weighted assessment' },
  { id: 'impact', label: 'Impact', sublabel: 'Dollar scenarios' },
];

const impactLabels: Record<ImpactCase, string> = {
  base: 'Base case',
  downside: 'Downside',
  severe: 'Severe',
  expected: 'Expected impact',
};

function money(value: number, digits = 1) {
  return `$${value.toFixed(digits)}M`;
}

function impactValue(scenario: IntelligenceScenario, key: ImpactCase) {
  const values = scenario.impact;
  return key === 'base' ? values.baseUsdM : key === 'downside' ? values.downsideUsdM : key === 'severe' ? values.severeUsdM : values.expectedUsdM;
}

function directionText(direction: ImpactDirection) {
  return direction === 'POSITIVE' ? 'Potentially positive' : direction === 'NEGATIVE' ? 'Potentially negative' : direction === 'MIXED' ? 'Mixed effects' : 'Uncertain';
}

function directionClass(direction: ImpactDirection) {
  return direction === 'NEGATIVE'
    ? 'text-[#e58a83]'
    : direction === 'POSITIVE'
      ? 'text-[#b8d784]'
      : direction === 'MIXED'
        ? 'text-[#d2bd83]'
        : 'text-[#a7b4bd]';
}

function transmissionClass(type: TransmissionType) {
  return type === 'DIRECT' ? 'border-[#627747] bg-[#1c2418] text-[#c2dc8f]' : 'border-[#39434a] bg-[#171d21] text-[#aebbc0]';
}

function MetricBlock({ label, value, note, accent }: { label: string; value: string; note?: string; accent?: boolean }) {
  return (
    <div className="min-w-0 border-l border-[#2b3234] pl-4 first:border-0 first:pl-0">
      <div className="text-[9px] font-semibold tracking-[.13em] text-[#7f898d]">{label}</div>
      <div className={`mono mt-2 text-[22px] leading-none tracking-[-.05em] sm:text-[26px] ${accent ? 'text-[#c6f477]' : 'text-[#f0f2ec]'}`}>{value}</div>
      {note && <div className="mt-2 text-[10px] leading-4 text-[#818b8f]">{note}</div>}
    </div>
  );
}

function ProbabilityHistory({ probability, change30d }: { probability: number; change30d: number }) {
  const [range, setRange] = useState<'24H' | '7D' | '30D'>('30D');
  const count = range === '24H' ? 9 : range === '7D' ? 12 : 16;
  const delta = range === '24H' ? change30d * 0.08 : range === '7D' ? change30d * 0.36 : change30d;
  const values = useMemo(() => {
    const start = Math.max(3, Math.min(96, probability - delta));
    return Array.from({ length: count }, (_, index) => {
      const progress = index / (count - 1);
      const wave = Math.sin(index * 1.6) * Math.abs(delta) * 0.12 + Math.cos(index * 0.71) * Math.abs(delta) * 0.08;
      return Math.max(3, Math.min(96, start + delta * progress + wave));
    }).map((value, index, all) => index === all.length - 1 ? probability : value);
  }, [count, delta, probability]);
  const points = values.map((value, index) => {
    const x = 12 + (index / (values.length - 1)) * 476;
    const y = 116 - (value / 100) * 100;
    return `${x},${y}`;
  }).join(' ');
  const previous = Math.max(0, probability - delta);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-medium text-[#dde2de]">Probability over time</div>
          <div className="mt-1 text-[10px] text-[#788387]">Illustrative history anchored to the bundled scenario</div>
        </div>
        <div className="flex rounded border border-[#2b3336] p-0.5" aria-label="Probability history timeframe">
          {(['24H', '7D', '30D'] as const).map((item) => (
            <button key={item} type="button" aria-pressed={range === item} onClick={() => setRange(item)}
              className={`min-h-7 rounded px-2.5 text-[9px] font-semibold tracking-[.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${range === item ? 'bg-[#29351b] text-[#c4ef7b]' : 'text-[#899398] hover:text-[#e9ede7]'}`}
              data-testid={`history-range-${item.toLowerCase()}`}>{item}</button>
          ))}
        </div>
      </div>
      <div className="chart-grid relative h-[150px] overflow-hidden rounded border border-[#252d30] bg-[#0d1112] px-2 pt-2">
        <div className="absolute left-2 top-2 z-10 flex flex-col justify-between text-[9px] text-[#586367]">
          <span>100%</span><span>50%</span><span>0%</span>
        </div>
        <svg viewBox="0 0 500 126" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`${range} probability history, ending at ${probability.toFixed(1)} percent`}>
          <defs>
            <linearGradient id="probability-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#b8f34a" stopOpacity=".16" />
              <stop offset="100%" stopColor="#b8f34a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`12,126 ${points} 488,126`} fill="url(#probability-fill)" />
          <polyline points={points} fill="none" stroke="#b8f34a" strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
          <line x1="12" x2="488" y1={116 - probability * 1.16} y2={116 - probability * 1.16} stroke="#b8f34a" strokeOpacity=".28" strokeDasharray="4 5" />
          <circle cx="488" cy={116 - probability * 1.16} r="4" fill="#b8f34a" stroke="#0d1112" strokeWidth="2" />
        </svg>
        <span className="absolute right-3 top-2 rounded bg-[#1c2718] px-1.5 py-1 mono text-[9px] text-[#c4f56a]">{probability.toFixed(1)}%</span>
        <div className="absolute bottom-2 left-9 right-3 flex justify-between text-[9px] text-[#5e686c]">
          <span>{range === '24H' ? '24h ago' : range === '7D' ? '7 days ago' : '30 days ago'}</span><span>Now</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded border border-[#252d30] px-3 py-2"><div className="text-[9px] uppercase tracking-[.1em] text-[#707b7f]">Previous</div><div className="mono mt-1 text-[12px] text-[#c4cbc8]">{previous.toFixed(1)}%</div></div>
        <div className="rounded border border-[#252d30] px-3 py-2"><div className="text-[9px] uppercase tracking-[.1em] text-[#707b7f]">{range} change</div><div className={`mono mt-1 text-[12px] ${delta >= 0 ? 'text-[#b8d784]' : 'text-[#e58a83]'}`}>{delta >= 0 ? '+' : ''}{delta.toFixed(1)} pp</div></div>
        <div className="rounded border border-[#252d30] px-3 py-2"><div className="text-[9px] uppercase tracking-[.1em] text-[#707b7f]">Current</div><div className="mono mt-1 text-[12px] text-[#c4f56a]">{probability.toFixed(1)}%</div></div>
      </div>
    </div>
  );
}

function WhyPanel({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="mt-3 rounded border border-[#3c4b29] bg-[#171f13] px-4 py-3" role="note">
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[9px] font-semibold tracking-[.12em] text-[#b8de78]">
        <span>{title}</span>
        <button type="button" onClick={onClose} aria-label="Close explanation" className="text-[#96a582] hover:text-white" data-testid="why-close">Close</button>
      </div>
      <div className="text-[11px] leading-5 text-[#adb7a5]">{children}</div>
    </div>
  );
}

export interface SignalDetailPageProps {
  scenario: IntelligenceScenario;
  onScenarioChange: (signalId: string) => void;
}

export default function SignalDetailPage({ scenario, onScenarioChange }: SignalDetailPageProps) {
  const [, setLocation] = useLocation();
  const [activeDrawer, setActiveDrawer] = useState<DrawerMode>(null);
  const [activeStage, setActiveStage] = useState('signal');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [whyOpen, setWhyOpen] = useState<string | null>(null);
  const [impactCase, setImpactCase] = useState<ImpactCase>('downside');
  const [activeTransmission, setActiveTransmission] = useState<number | null>(null);
  const [watchlisted, setWatchlisted] = useState(false);
  const [technicalOpen, setTechnicalOpen] = useState(false);

  const riskScore = useMemo(() => calculateRiskScore(scenario.riskScoreFactors), [scenario.riskScoreFactors]);
  const totalExposure = sumExposureUsdM(scenario.exposures.map((item) => item.amountUsdM));
  const impactCalculation = calculateImpactEstimate({
    probabilityPct: scenario.consensus.probabilityPct,
    exposureUsdM: scenario.impact.exposureBasisUsdM,
    scenarioMagnitudePct: scenario.impact.scenarioMagnitudePct,
  });
  const selectedImpact = impactValue(scenario, impactCase);
  const lowP = Math.min(...scenario.consensus.venues.map((venue) => venue.probabilityPct));
  const highP = Math.max(...scenario.consensus.venues.map((venue) => venue.probabilityPct));
  const transmissionSteps = [...scenario.risk.transmission.direct, ...scenario.risk.transmission.indirect];
  const activeContract = selectedContract ?? scenario.contracts[0];
  const scoreTone = riskScore.level === 'CRITICAL' || riskScore.level === 'HIGH' ? 'text-[#f08a82]' : riskScore.level === 'MEDIUM' ? 'text-[#d9bd7e]' : 'text-[#bfd48a]';
  const totalExposureLabel = money(totalExposure);
  const showWhy = (key: string) => setWhyOpen((current) => current === key ? null : key);
  const scrollTo = (id: string) => {
    setActiveStage(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const openContract = (contract: Contract) => {
    setSelectedContract(contract);
    setActiveDrawer('contract');
  };

  useEffect(() => {
    setActiveDrawer(null);
    setSelectedContract(null);
    setWhyOpen(null);
    setImpactCase('downside');
  }, [scenario.signal.id]);

  useEffect(() => {
    const targets = stages.map((stage) => document.getElementById(stage.id)).filter((element): element is HTMLElement => element !== null);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveStage(visible.target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.2, 0.5] });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-enter mx-auto w-full max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-8" data-testid="signal-detail-page">
      <nav aria-label="Intelligence pipeline" className="soft-scrollbar mb-5 overflow-x-auto rounded border border-[#293134] bg-[#101416]">
        <ol className="flex min-w-[860px] items-stretch">
          {stages.map((stage, index) => (
            <li key={stage.id} className="flex flex-1 items-stretch">
              <button type="button" onClick={() => scrollTo(stage.id)} data-testid={`pipeline-${stage.id}`}
                className={`group flex min-h-[58px] flex-1 items-center gap-2.5 border-b-2 px-3 text-left transition-colors hover:bg-[#171d1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b8f34a] ${activeStage === stage.id ? 'border-[#b8f34a] bg-[#151b17]' : 'border-transparent'}`}>
                <span className={`mono text-[9px] ${activeStage === stage.id ? 'text-[#b8f34a]' : 'text-[#596468]'}`}>{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className={`block whitespace-nowrap text-[10px] font-semibold ${activeStage === stage.id ? 'text-[#d3f69b]' : 'text-[#a6afb1]'}`}>{stage.label}</span>
                  <span className="mt-1 block whitespace-nowrap text-[9px] text-[#677276]">{stage.sublabel}</span>
                </span>
                {index < stages.length - 1 && <ArrowRight className="ml-auto shrink-0 text-[#465054]" size={12} />}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section id="signal" className="panel mb-5 scroll-mt-5 overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded border border-[#39442b] bg-[#192016] px-2 py-1 text-[9px] font-semibold tracking-[.12em] text-[#b8df76]"><Radio size={11} /> EXTERNAL SIGNAL</span>
              <span className="rounded border border-[#2a3336] px-2 py-1 text-[9px] font-medium tracking-[.08em] text-[#9aa5a8]">PREDICTION MARKET</span>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[.1em] text-[#c1ed77]"><span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />{scenario.signal.status}</span>
            </div>
            <h1 className="max-w-4xl text-[24px] font-semibold leading-[1.16] tracking-[-.045em] text-[#f0f2ed] sm:text-[31px] lg:text-[36px]">{scenario.signal.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-[#7f8a8e]">
              <span className="inline-flex items-center gap-1.5"><Landmark size={12} /> Source: <strong className="font-medium text-[#bbc3c1]">{scenario.signal.source}</strong></span>
              <span className="hidden h-3 w-px bg-[#333b3e] sm:block" />
              <span className="inline-flex items-center gap-1.5"><Clock3 size={12} /> Updated {scenario.signal.freshness}</span>
              <span className="hidden h-3 w-px bg-[#333b3e] sm:block" />
              <span className="mono">Last updated {scenario.signal.lastUpdated}</span>
            </div>
          </div>
          <label className="flex min-w-[210px] flex-col gap-1.5 text-[9px] font-semibold tracking-[.12em] text-[#758084] lg:mb-1">
            DEMO SCENARIO
            <span className="relative">
              <select value={scenario.signal.id} onChange={(event) => onScenarioChange(event.target.value)} data-testid="scenario-selector"
                className="h-10 w-full appearance-none rounded border border-[#353e41] bg-[#151a1c] px-3 pr-9 text-[11px] font-medium tracking-normal text-[#e2e6e1] outline-none transition-colors hover:border-[#788f4c] focus:border-[#b8f34a] focus:ring-1 focus:ring-[#b8f34a]">
                {intelligenceScenarios.map((item) => <option key={item.signal.id} value={item.signal.id}>{item.label} · {item.signal.title}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={13} className="pointer-events-none absolute right-3 top-3 text-[#899397]" />
            </span>
          </label>
        </div>
        <div className="grid grid-cols-2 border-t border-[#262e30] px-5 py-5 sm:grid-cols-4 sm:px-7">
          <div className="pr-3 sm:pr-5">
            <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[.12em] text-[#758084]">CURRENT PROBABILITY <WhyButton label="Probability" onClick={() => showWhy('probability')} /></div>
            <div className="mono mt-2 text-[27px] leading-none tracking-[-.06em] text-[#c8f47e] sm:text-[31px]">{scenario.signal.probabilityPct.toFixed(1)}%</div>
            <div className="mt-2 text-[10px] text-[#8c979a]">YES probability</div>
          </div>
          <div className="border-l border-[#2c3436] pl-4 sm:pl-6">
            <div className="text-[9px] font-semibold tracking-[.12em] text-[#758084]">30D CHANGE</div>
            <div className={`mono mt-2 text-[22px] leading-none tracking-[-.04em] ${scenario.signal.change30dPp >= 0 ? 'text-[#b6ce83]' : 'text-[#e18a83]'}`}>{scenario.signal.change30dPp >= 0 ? '+' : ''}{scenario.signal.change30dPp.toFixed(1)} pp</div>
            <div className="mt-2 text-[10px] text-[#8c979a]">Signal momentum</div>
          </div>
          <div className="mt-5 border-l border-[#2c3436] pl-4 sm:mt-0 sm:pl-6">
            <div className="text-[9px] font-semibold tracking-[.12em] text-[#758084]">SIGNAL STRENGTH</div>
            <div className="mt-2 text-[15px] font-semibold tracking-[.08em] text-[#e5e9e2]">{scenario.signal.strength}</div>
            <div className="mt-2 text-[10px] text-[#8c979a]">{scenario.signal.category}</div>
          </div>
          <div className="mt-5 border-l border-[#2c3436] pl-4 sm:mt-0 sm:pl-6">
            <div className="text-[9px] font-semibold tracking-[.12em] text-[#758084]">RISK CLASSIFICATION</div>
            <div className={`mt-2 text-[15px] font-semibold tracking-[.04em] ${scoreTone}`}>{scenario.signal.riskLevel}</div>
            <div className="mt-2 text-[10px] text-[#8c979a]">{scenario.risk.name}</div>
          </div>
        </div>
      </section>

      <div className="mb-9 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-[#8c979a]">A market signal, normalized into an event and traced to potential business consequences.</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setActiveDrawer('provenance')} data-testid="open-provenance"
            className="inline-flex min-h-8 items-center gap-1.5 rounded border border-[#30393c] px-2.5 text-[10px] text-[#aab4b5] hover:border-[#879d58] hover:text-[#dce9c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]"><FileCheck2 size={12} /> Provenance</button>
          <button type="button" onClick={() => setTechnicalOpen((current) => !current)} data-testid="open-technical-details" aria-expanded={technicalOpen}
            className="inline-flex min-h-8 items-center gap-1.5 rounded border border-[#30393c] px-2.5 text-[10px] text-[#aab4b5] hover:border-[#879d58] hover:text-[#dce9c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]"><SlidersHorizontal size={12} /> Technical details</button>
        </div>
      </div>
      {technicalOpen && <section className="mb-8 rounded border border-[#334044] bg-[#101618] p-4" data-testid="technical-details-inline">
        <SectionHeading eyebrow="ADVANCED VIEW" title="Technical details" detail="Identifiers and model inputs for this illustrative intelligence record." />
        <dl className="grid gap-x-6 sm:grid-cols-2">
          <DefinitionRow label="Signal ID" mono>{scenario.signal.id}</DefinitionRow>
          <DefinitionRow label="Contract ID" mono>{scenario.contracts[0]?.id}</DefinitionRow>
          <DefinitionRow label="Canonical Event ID" mono>{scenario.canonicalEvent.id}</DefinitionRow>
          <DefinitionRow label="Fingerprint" mono>{scenario.contracts[0]?.fingerprint}</DefinitionRow>
              <DefinitionRow label="Match score">{scenario.contracts[0]?.fellegiSunterScorePct ?? scenario.contracts[0]?.matchScorePct}% · illustrative Fellegi–Sunter score</DefinitionRow>
          <DefinitionRow label="Oracle compatibility">{scenario.contracts.every((contract) => contract.oracleCompatible) ? 'All observed contracts compatible' : 'Mixed — semantic review required'}</DefinitionRow>
          <DefinitionRow label="Venue weights">{scenario.consensus.venues.map((venue) => `${venue.venue} ${venue.weightPct}%`).join(' · ')}</DefinitionRow>
          <DefinitionRow label="Consensus / ΔP">{scenario.consensus.probabilityPct.toFixed(1)}% / {scenario.consensus.disagreementPp.toFixed(1)} pp</DefinitionRow>
          <DefinitionRow label="Risk score">{riskScore.score} / 100 · {riskScore.level}</DefinitionRow>
          <DefinitionRow label="Exposure model">Illustrative business-unit allocation</DefinitionRow>
          <DefinitionRow label="Scenario model">Probability × exposure basis × scenario magnitude</DefinitionRow>
          <DefinitionRow label="Calculation timestamp" mono>{scenario.provenance.calculatedAt}</DefinitionRow>
        </dl>
      </section>}

      <section id="contract" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="01 / SOURCE SIGNAL" title="Market signal" detail="The original contract is the input—not the final business interpretation." />
        <div className="grid gap-4 xl:grid-cols-[1.04fr_.96fr]">
          <article className="panel p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[.12em] text-[#9fa9ab]"><Landmark size={13} className="text-[#b8f34a]" /> SOURCE CONTRACT</div>
              <button type="button" onClick={() => openContract(scenario.contracts[0])} className="inline-flex items-center gap-1 text-[10px] text-[#9da8a7] hover:text-[#c5f579] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="open-source-contract">Inspect contract <ArrowUpRight size={11} /></button>
            </div>
            <h3 className="text-[14px] font-medium leading-6 text-[#e5e9e4]">{scenario.contracts[0]?.question}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-6">
              <DefinitionRow label="Venue">{scenario.contracts[0]?.venue}</DefinitionRow>
              <DefinitionRow label="Outcome">{scenario.contracts[0]?.outcome}</DefinitionRow>
              <DefinitionRow label="Liquidity">{money(scenario.contracts[0]?.liquidityUsdM ?? 0)}</DefinitionRow>
              <DefinitionRow label="Volume">{money(scenario.contracts[0]?.volumeUsdM ?? 0)}</DefinitionRow>
              <DefinitionRow label="Freshness">{scenario.contracts[0]?.freshness}</DefinitionRow>
               <DefinitionRow label="Market status">{scenario.contracts[0]?.status ?? scenario.signal.status}</DefinitionRow>
            </dl>
            <TogglePanel title="Contract details" hint="Identifiers, resolution and source metadata" testId="toggle-contract-details">
              <dl className="grid gap-x-6 sm:grid-cols-2">
                <DefinitionRow label="Contract ID" mono>{scenario.contracts[0]?.id}</DefinitionRow>
                <DefinitionRow label="Market ID" mono>{scenario.contracts[0]?.marketId}</DefinitionRow>
                <DefinitionRow label="Resolution source">{scenario.contracts[0]?.resolutionSource}</DefinitionRow>
                <DefinitionRow label="Resolution date" mono>{scenario.contracts[0]?.resolutionDate}</DefinitionRow>
                <DefinitionRow label="Outcome definitions">{scenario.contracts[0]?.outcomes.join(' / ')}</DefinitionRow>
                <DefinitionRow label="Created / updated" mono>{scenario.contracts[0]?.createdAt} / {scenario.contracts[0]?.updatedAt}</DefinitionRow>
                <DefinitionRow label="Data freshness">{scenario.contracts[0]?.freshness}</DefinitionRow>
                <DefinitionRow label="Oracle compatibility">{scenario.contracts[0]?.oracleCompatible ? 'Compatible' : 'Requires review'}</DefinitionRow>
                <DefinitionRow label="Resolution semantics">{scenario.contracts[0]?.resolutionSemantics}</DefinitionRow>
                <DefinitionRow label="Source URL" mono>{scenario.contracts[0]?.sourceUrl}</DefinitionRow>
              </dl>
            </TogglePanel>
          </article>
          <article className="panel p-4 sm:p-5">
            <ProbabilityHistory probability={scenario.signal.probabilityPct} change30d={scenario.signal.change30dPp} />
          </article>
        </div>
        {whyOpen === 'probability' && <WhyPanel title="WHY THIS PROBABILITY?" onClose={() => setWhyOpen(null)}>
          {scenario.contracts.length} observed contracts across {new Set(scenario.contracts.map((contract) => contract.venue)).size} venues. Venue consensus is weighted for liquidity, freshness and match quality: {scenario.consensus.probabilityPct.toFixed(1)}%, with {scenario.consensus.disagreementPp.toFixed(1)} pp disagreement and {scenario.consensus.confidence.toLowerCase()} confidence. The source probability remains the selected venue's reading.
        </WhyPanel>}
      </section>

      <section id="event" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="02 / NORMALIZED EVENT" title="Canonical event" detail="The raw market question can vary by venue. Exogen resolves the shared event identity before assessing business relevance." />
        <article className="relative overflow-hidden rounded-[9px] border border-[#465638] bg-[#121813] p-5 sm:p-7">
          <div className="absolute bottom-0 right-0 top-0 hidden w-[24%] border-l border-[#253123] bg-[#182018] lg:block" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_250px]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded border border-[#667c45] bg-[#202a1a] px-2 py-1 text-[9px] font-semibold tracking-[.12em] text-[#c0e47b]">{scenario.canonicalEvent.matchStatus}</span>
                <span className="mono text-[10px] text-[#7f8c80]">{scenario.canonicalEvent.id}</span>
              </div>
              <h3 className="max-w-3xl text-[19px] font-semibold leading-[1.35] tracking-[-.03em] text-[#e6ecdf] sm:text-[23px]">{scenario.canonicalEvent.title}</h3>
              <p className="mt-3 max-w-3xl text-[12px] leading-6 text-[#9ba79a]">{scenario.canonicalEvent.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => showWhy('event')} className="inline-flex items-center gap-1.5 text-[10px] text-[#b8d887] hover:text-[#d2f69d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="event-match-explanation"><CircleHelp size={12} /> Why this match?</button>
                <button type="button" onClick={() => setLocation(`/events/${encodeURIComponent(scenario.canonicalEvent.id)}`)} className="inline-flex items-center gap-1.5 text-[10px] text-[#b8d887] hover:text-[#d2f69d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="inspect-canonical-event"><Sparkles size={12} /> Inspect Canonical Event →</button>
                <button type="button" onClick={() => setLocation('/matching')} className="inline-flex items-center gap-1.5 text-[10px] text-[#b8d887] hover:text-[#d2f69d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="view-matching-analysis"><GitBranch size={12} /> View matching analysis →</button>
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-1 lg:py-2">
              <div><div className="text-[9px] tracking-[.12em] text-[#81907e]">IDENTITY CONFIDENCE</div><div className="mono mt-1.5 text-[23px] text-[#c5ed83]">{scenario.canonicalEvent.identityConfidencePct.toFixed(1)}%</div></div>
              <div><div className="text-[9px] tracking-[.12em] text-[#81907e]">MATCHED CONTRACTS</div><div className="mono mt-1.5 text-[20px] text-[#e1e6db]">{scenario.contracts.length}</div></div>
              <div><div className="text-[9px] tracking-[.12em] text-[#81907e]">SOURCE VENUES</div><div className="mono mt-1.5 text-[20px] text-[#e1e6db]">{new Set(scenario.contracts.map((contract) => contract.venue)).size}</div></div>
            </div>
          </div>
          {whyOpen === 'event' && <WhyPanel title="WHY THIS CANONICAL MATCH?" onClose={() => setWhyOpen(null)}>{scenario.canonicalEvent.matchExplanation} Identity confidence reflects alignment across event subject, outcome, location, deadline and resolution semantics; it is illustrative demo data.</WhyPanel>}
          <div className="relative mt-6 border-t border-[#293329] pt-5">
            <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-[.13em] text-[#849184]"><GitBranch size={12} /> CONTRACTS NORMALIZED TO ONE EVENT</div>
            <div className="grid gap-2 sm:grid-cols-3">
              {scenario.contracts.map((contract) => (
                <button type="button" key={contract.id} onClick={() => openContract(contract)} data-testid={`matched-contract-${contract.id}`}
                  className="group min-w-0 rounded border border-[#303b32] bg-[#111713] p-3 text-left transition-colors hover:border-[#849d58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]">
                  <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-medium text-[#d3dbce]">{contract.venue}</span><span className="mono text-[9px] text-[#b8dc7b]">{contract.matchScorePct}% match</span></div>
                  <div className="mt-2 line-clamp-2 text-[10px] leading-4 text-[#87928c]">{contract.question}</div>
                  <div className="mt-3 flex items-center justify-between"><span className="mono text-[12px] text-[#d9e3cf]">{contract.probabilityPct.toFixed(1)}%</span><span className="text-[9px] text-[#68746d]">{contract.freshness} · {money(contract.liquidityUsdM)} liq.</span></div>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#9bad87]"><span className="h-px w-8 bg-[#46563b]" /><ArrowDownRight size={12} /> Canonical event <span className="h-px w-8 bg-[#46563b]" /></div>
          </div>
          <div className="relative mt-3 grid gap-3 md:grid-cols-2">
            <TogglePanel title="Matched market contracts" hint="Select a contract to inspect its source details" testId="toggle-matched-contracts">
              <div className="soft-scrollbar overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-[10px]">
                  <thead className="text-[9px] uppercase tracking-[.1em] text-[#707d74]"><tr><th className="pb-2 font-medium">Venue / contract</th><th className="pb-2 font-medium">Probability</th><th className="pb-2 font-medium">Liquidity</th><th className="pb-2 font-medium">Freshness</th><th className="pb-2 font-medium">Match</th></tr></thead>
                  <tbody>{scenario.contracts.map((contract) => <tr key={contract.id} className="border-t border-[#28312a]">
                    <td className="py-2 pr-3"><button type="button" className="text-left text-[#d2ddcb] hover:text-[#c3ee7b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" onClick={() => openContract(contract)} data-testid={`contract-row-${contract.id}`}>{contract.venue}<span className="mt-0.5 block max-w-[200px] truncate text-[9px] text-[#77837a]">{contract.question}</span></button></td>
                    <td className="mono py-2 pr-3 text-[#cbd5c6]">{contract.probabilityPct.toFixed(1)}%</td><td className="mono py-2 pr-3 text-[#aeb9ad]">{money(contract.liquidityUsdM)}</td><td className="mono py-2 pr-3 text-[#9da99e]">{contract.freshness}</td><td className="mono py-2 text-[#c2df8d]">{contract.matchScorePct}%</td>
                  </tr>)}</tbody>
                </table>
              </div>
            </TogglePanel>
            <TogglePanel title="Event fingerprint" hint="Identity features used for normalized matching" testId="toggle-fingerprint">
              <div className="mb-3 mono text-[12px] text-[#bfe87a]">F = (T, L, O, S)</div>
              <dl className="grid grid-cols-2 gap-x-4">
                <DefinitionRow label="T · Time">{scenario.canonicalEvent.fingerprint.time}</DefinitionRow>
                <DefinitionRow label="L · Location">{scenario.canonicalEvent.fingerprint.location}</DefinitionRow>
                <DefinitionRow label="O · Outcome">{scenario.canonicalEvent.fingerprint.outcome}</DefinitionRow>
                <DefinitionRow label="S · Subject">{scenario.canonicalEvent.fingerprint.subject}</DefinitionRow>
              </dl>
              <p className="mt-2 text-[10px] text-[#87928a]">Identity confidence: <span className="mono text-[#c2df8d]">{scenario.canonicalEvent.identityConfidencePct.toFixed(1)}%</span></p>
            </TogglePanel>
          </div>
        </article>
      </section>

      <section id="consensus" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="03 / CROSS-VENUE SYNTHESIS" title="Market consensus" detail="A weighted event probability is more useful than any single contract—especially when the venues disagree." />
        <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <article className="panel relative overflow-hidden p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-[.82fr_1.18fr] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[.14em] text-[#899496]"><Waves size={13} className="text-[#b8f34a]" /> CANONICAL PROBABILITY</div>
                <div className="mono mt-4 text-[48px] leading-none tracking-[-.07em] text-[#c5f27c] sm:text-[56px]">{scenario.consensus.probabilityPct.toFixed(1)}<span className="text-[28px]">%</span></div>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-[#8b9698]"><span className={`h-1.5 w-1.5 rounded-full ${scenario.consensus.confidence === 'HIGH' ? 'bg-[#b8f34a]' : scenario.consensus.confidence === 'MEDIUM' ? 'bg-[#d8bd77]' : 'bg-[#8c979a]'}`} />{scenario.consensus.confidence} consensus confidence</div>
              </div>
              <div className="space-y-3">
                {scenario.consensus.venues.map((venue) => <div key={venue.venue}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px]"><span className="text-[#b9c2c0]">{venue.venue}</span><span className="mono text-[#d7ded7]">{venue.probabilityPct.toFixed(1)}% <span className="text-[#747f81]">· {venue.weightPct}% weight</span></span></div>
                  <div className="h-1.5 overflow-hidden rounded-sm bg-[#252d2f]"><div className="h-full rounded-sm bg-[#a9ce65]" style={{ width: `${Math.max(3, venue.weightPct)}%` }} /></div>
                </div>)}
                <div className="pt-1 text-[9px] text-[#6e797c]">Bars show venue weight, not market share.</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#293134] pt-4">
              <p className="max-w-xl text-[11px] leading-5 text-[#8e999b]">{scenario.consensus.explanation}</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setLocation('/data-quality')} className="inline-flex items-center gap-1 text-[10px] text-[#b8f34a] hover:underline" data-testid="view-source-contracts">
                  <span>View source contracts →</span>
                </button>
                <button type="button" onClick={() => showWhy('consensus')} className="inline-flex items-center gap-1 text-[10px] text-[#adc87a] hover:text-[#d4f19a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="why-consensus"><CircleHelp size={12} /> Why this consensus</button>
              </div>
            </div>
            {whyOpen === 'consensus' && <WhyPanel title="WHY THIS CONSENSUS?" onClose={() => setWhyOpen(null)}>
              {scenario.consensus.venues.map((venue) => `${venue.venue} ${venue.weightPct}%`).join(' · ')}. Weights reflect market liquidity, data freshness, oracle quality and venue reliability. Confidence is {scenario.consensus.confidence.toLowerCase()} because the observed range is {lowP.toFixed(1)}%–{highP.toFixed(1)}%.
            </WhyPanel>}
          </article>
          <article className="panel flex flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[.14em] text-[#899496]"><Activity size={13} className="text-[#c5be83]" /> CROSS-VENUE AGREEMENT</div>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div><div className="mono text-[36px] leading-none tracking-[-.06em] text-[#e6e8df]">{scenario.consensus.disagreementPp.toFixed(1)} <span className="text-[16px] text-[#9ca5a5]">pp</span></div><div className="mt-2 text-[10px] text-[#7c8789]">ΔP · widest observed spread</div></div>
                <span className={`rounded border px-2 py-1 text-[9px] font-semibold tracking-[.1em] ${scenario.consensus.disagreementLevel === 'LOW' ? 'border-[#445638] text-[#b9d68a]' : scenario.consensus.disagreementLevel === 'MODERATE' ? 'border-[#5c5032] text-[#d4bd7e]' : 'border-[#60403b] text-[#e29085]'}`}>{scenario.consensus.disagreementLevel} DISAGREEMENT</span>
              </div>
            </div>
            <p className="mt-5 border-t border-[#293134] pt-4 text-[11px] leading-5 text-[#929d9f]">
              {scenario.consensus.disagreementLevel === 'LOW' ? 'Estimates are closely aligned; consensus is supported across observed venues.' : scenario.consensus.disagreementLevel === 'MODERATE' ? 'Venue estimates differ enough to widen uncertainty. Treat the consensus as a synthesis, not a precise point forecast.' : 'Venue estimates diverge materially. Review source contracts and resolution definitions before relying on the consensus.'}
            </p>
          </article>
        </div>
      </section>

      <div className="mb-12 rounded border border-[#334037] bg-[#111714] px-4 py-5 sm:px-6">
        <div className="grid gap-4 text-center sm:grid-cols-3 sm:items-center">
          <div><div className="text-[9px] font-semibold tracking-[.14em] text-[#77877b]">EXTERNAL WORLD</div><div className="mt-1 text-[11px] text-[#c0c9be]">{scenario.signal.source} signal</div></div>
          <div className="relative"><div className="hidden sm:absolute sm:left-0 sm:top-3 sm:block sm:w-full sm:border-t sm:border-[#394539]" /><span className="relative bg-[#111714] px-2 text-[#9ebc72]"><ArrowDownRight size={15} className="mx-auto sm:hidden" /><span className="hidden sm:inline">↓</span></span><div className="text-[9px] font-semibold tracking-[.14em] text-[#77877b] sm:mt-1">CANONICAL EVENT</div><div className="mt-1 text-[11px] text-[#c0c9be]">{scenario.canonicalEvent.title}</div></div>
          <div><div className="text-[9px] font-semibold tracking-[.14em] text-[#a7bb86]">BUSINESS RISK</div><div className="mt-1 text-[11px] text-[#d1d9c8]">{scenario.risk.name}</div></div>
        </div>
      </div>

      <section id="risk" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="04 / TRANSMISSION TO BUSINESS" title={`Why does this matter to ${scenario.company}?`} detail="An external event becomes relevant when there is a credible path into business activity." />
        <div className="grid gap-4 xl:grid-cols-[.92fr_1.08fr]">
          <article className="panel p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-[9px] font-semibold tracking-[.13em] text-[#919b9d]"><ShieldAlert size={13} className="text-[#c5be83]" /> RISK CLASSIFICATION</div>
            <div className="text-[21px] font-semibold tracking-[-.03em] text-[#e7e9e3]">{scenario.risk.name}</div>
            <dl className="mt-4">
              <DefinitionRow label="Category">{scenario.risk.category}</DefinitionRow>
              <DefinitionRow label="Relationship"><span className={`rounded border px-2 py-1 text-[9px] font-semibold tracking-[.09em] ${transmissionClass(scenario.risk.relationship)}`}>{scenario.risk.relationship}</span></DefinitionRow>
              <DefinitionRow label="Impact direction"><span className={directionClass(scenario.risk.direction)}>{directionText(scenario.risk.direction)}</span></DefinitionRow>
              <DefinitionRow label="Risk confidence">{scenario.risk.confidencePct}%</DefinitionRow>
            </dl>
          </article>
          <article className="panel p-5 sm:p-6">
            <SectionHeading eyebrow="TRANSMISSION LOGIC" title="Why does this event create risk?" />
            <p className="text-[12px] leading-6 text-[#aab3b1]">{scenario.risk.explanation}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="rounded border border-[#435236] bg-[#171e15] p-3">
                <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-[.12em] text-[#bddb86]"><Link2 size={12} /> DIRECT TRANSMISSION</div>
                <ol className="space-y-2">{scenario.risk.transmission.direct.map((node, index) => <li key={node}><button type="button" onClick={() => setActiveTransmission(index)} data-testid={`transmission-direct-${index}`}
                  className={`flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-[10px] leading-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${activeTransmission === index ? 'bg-[#26321e] text-[#d6e9b7]' : 'text-[#9ca99a] hover:bg-[#1d271b]'}`}><span className="mono text-[#adc879]">{String(index + 1).padStart(2, '0')}</span>{node}</button></li>)}</ol>
              </div>
              <div className="rounded border border-[#333e43] bg-[#151a1d] p-3">
                <div className="mb-3 flex items-center gap-2 text-[9px] font-semibold tracking-[.12em] text-[#9fb2ba]"><GitBranch size={12} /> INDIRECT TRANSMISSION</div>
                <ol className="space-y-2">{scenario.risk.transmission.indirect.map((node, index) => <li key={node}><button type="button" onClick={() => setActiveTransmission(scenario.risk.transmission.direct.length + index)} data-testid={`transmission-indirect-${index}`}
                  className={`flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-[10px] leading-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${activeTransmission === scenario.risk.transmission.direct.length + index ? 'bg-[#222d31] text-[#cfdbdd]' : 'text-[#9aa7aa] hover:bg-[#1c2326]'}`}><span className="mono text-[#94acb3]">{String(index + 1).padStart(2, '0')}</span>{node}</button></li>)}</ol>
              </div>
            </div>
            {activeTransmission !== null && <div className="mt-3 rounded border border-[#323c3f] bg-[#0f1416] px-3 py-2.5 text-[10px] leading-5 text-[#9da8a9]" aria-live="polite">
              <span className="mr-2 font-semibold text-[#d7dfd9]">Transmission step</span>{transmissionSteps[activeTransmission]}. This pathway connects the event mechanism to the modeled business-unit impacts below.
            </div>}
          </article>
        </div>
      </section>

      <section id="exposure" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="05 / DEMONSTRATION COMPANY" title={`${scenario.company} exposure`}
          detail="Illustrative exposure model only. These figures are not actual or confidential JPMorgan positions."
          action={<span className="inline-flex items-center gap-1.5 rounded border border-[#4c5137] bg-[#1a1c15] px-2.5 py-1.5 text-[9px] font-semibold tracking-[.08em] text-[#c8c28f]"><Building2 size={11} /> DEMO / MOCK EXPOSURE</span>} />
        <div className="panel mb-4 grid grid-cols-2 gap-y-4 p-4 sm:grid-cols-4 sm:p-5">
          <MetricBlock label="TOTAL MODELED EXPOSURE" value={totalExposureLabel} note="Across listed business units" accent />
          <MetricBlock label="BUSINESS UNITS AFFECTED" value={String(scenario.exposures.length)} note="Direct and indirect paths" />
          <MetricBlock label="HIGH-IMPACT SIGNALS" value={String(scenario.signal.highImpactSignalsCount ?? 0)} note="Company-wide watch count" />
          <MetricBlock label="HIGH-SENSITIVITY UNITS" value={String(scenario.exposures.filter((unit) => unit.sensitivity === 'HIGH').length)} note="Within this event model" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {scenario.exposures.map((exposure) => <ExposureCard key={exposure.id} exposure={exposure} onClick={() => showWhy(`exposure-${exposure.id}`)} isOpen={whyOpen === `exposure-${exposure.id}`} onClose={() => setWhyOpen(null)} />)}
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.86fr]">
          <article className="panel p-5 sm:p-6">
            <SectionHeading eyebrow="EVENT → RISK → BUSINESS UNIT" title="Exposure mapping" detail="The event is translated into a risk pathway, then allocated to affected business units." />
            <div className="flex flex-col items-center">
              <div className="max-w-full rounded border border-[#465638] bg-[#192016] px-4 py-2.5 text-center">
                <div className="text-[8px] font-semibold tracking-[.12em] text-[#89967e]">CANONICAL EVENT</div>
                <div className="mt-1 max-w-[360px] text-[11px] text-[#d1ddc2]">{scenario.canonicalEvent.title}</div>
              </div>
              <div className="h-6 border-l border-[#4b5c3b]" />
              <div className="rounded border border-[#384147] bg-[#171d20] px-4 py-2.5 text-center">
                <div className="text-[8px] font-semibold tracking-[.12em] text-[#7f8e92]">RISK CHANNEL</div>
                <div className="mt-1 text-[11px] text-[#d2d9d8]">{scenario.risk.name}</div>
              </div>
              <div className="h-5 border-l border-[#414b4c]" />
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {scenario.exposures.map((exposure) => <button key={exposure.id} type="button" onClick={() => showWhy(`exposure-${exposure.id}`)}
                  className="flex items-center justify-between gap-3 rounded border border-[#2d3738] bg-[#121718] px-3 py-2.5 text-left hover:border-[#77884d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid={`exposure-node-${exposure.id}`}>
                  <span className="min-w-0"><span className="block truncate text-[10px] text-[#d3dbd5]">{exposure.name}</span><span className="mt-1 block text-[8px] tracking-[.1em] text-[#77827f]">{exposure.transmission} · {directionText(exposure.direction)}</span></span>
                  <span className="mono shrink-0 text-[12px] text-[#c6dc9b]">{money(exposure.amountUsdM)}</span>
                </button>)}
              </div>
              <div className="mt-3 border-t border-dashed border-[#414c44] pt-3 text-center"><div className="text-[8px] font-semibold tracking-[.12em] text-[#77827a]">TOTAL ILLUSTRATIVE EXPOSURE</div><div className="mono mt-1 text-[16px] text-[#c8e895]">{totalExposureLabel}</div></div>
            </div>
          </article>
          <article className="panel p-5 sm:p-6">
            <SectionHeading eyebrow="TRANSMISSION TYPE" title="Direct vs. indirect" detail="Separate immediate rate- or event-sensitive activity from second-order effects." />
            <div className="space-y-3">
              <div className="rounded border border-[#435236] bg-[#171e15] p-4">
                <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold tracking-[.12em] text-[#c3df8b]"><span className="h-1.5 w-1.5 rounded-full bg-[#a8c96c]" /> DIRECT EXPOSURE</div>
                <p className="text-[11px] leading-5 text-[#a5b09e]">{scenario.exposures.filter((item) => item.transmission === 'DIRECT').map((item) => item.name).join(', ') || 'No direct unit mapping in this scenario.'}</p>
                <div className="mt-3 border-t border-[#343f30] pt-2 text-[10px] text-[#8b9883]">Event-sensitive business activity → first-order repricing</div>
              </div>
              <div className="rounded border border-[#364147] bg-[#151b1e] p-4">
                <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold tracking-[.12em] text-[#aabdc3]"><span className="h-1.5 w-1.5 rounded-full bg-[#8ea6ac]" /> INDIRECT EXPOSURE</div>
                <p className="text-[11px] leading-5 text-[#a4afb1]">{scenario.exposures.filter((item) => item.transmission === 'INDIRECT').map((item) => item.name).join(', ') || 'No indirect unit mapping in this scenario.'}</p>
                <div className="mt-3 border-t border-[#313d42] pt-2 text-[10px] text-[#829196]">Market repricing → client behavior → unit impact</div>
              </div>
            </div>
            <div className="mt-4 border-t border-[#2b3436] pt-3">
              <div className="mb-2 text-[9px] font-semibold tracking-[.12em] text-[#7e898b]">IMPACT DIRECTION IS NOT A SIMPLE GAIN / LOSS</div>
              <div className="space-y-2">{scenario.exposures.map((unit) => <div className="flex items-center justify-between gap-3 text-[10px]" key={unit.id}><span className="text-[#9aa4a4]">{unit.name}</span><span className={directionClass(unit.direction)}>{directionText(unit.direction)}</span></div>)}</div>
            </div>
          </article>
        </div>
      </section>

      <section id="score" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="06 / COMPOSITE ASSESSMENT" title="Exogen risk score" detail="A weighted score makes the assessment comparable; its components remain visible and inspectable."
          action={<div className="flex items-center gap-2"><button type="button" onClick={() => setLocation('/risk/scores/RS-FED-RATE-CUT')} className="inline-flex items-center gap-1 rounded border border-[#3b4440] bg-[#111618] px-2 py-1 text-[10px] text-[#b8f34a] hover:bg-[#1a201b]">Quantitative Detail →</button><WhyButton label="Risk score" onClick={() => showWhy('risk-score')} /></div>} />
        <article className="panel grid gap-6 p-5 sm:p-6 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
          <div className="flex items-center gap-5">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[5px] border-[#293134] sm:h-32 sm:w-32" style={{ background: `conic-gradient(#b8f34a ${riskScore.score * 3.6}deg, #293134 0deg)` }}>
              <div className="absolute inset-[6px] rounded-full border border-[#313a3c] bg-[#111618]" />
              <div className="relative text-center"><div className="mono text-[31px] leading-none tracking-[-.06em] text-[#eef1e8]">{riskScore.score}</div><div className="mt-1 text-[8px] tracking-[.12em] text-[#788385]">OF 100</div></div>
            </div>
            <div><div className={`text-[22px] font-semibold tracking-[.04em] ${scoreTone}`}>{riskScore.level}</div><div className="mt-1 max-w-[160px] text-[10px] leading-4 text-[#869194]">Weighted assessment of event, severity and modeled business pathways.</div></div>
          </div>
          <div>
            <div className="mb-4 text-[9px] font-semibold tracking-[.13em] text-[#889395]">WEIGHTED COMPONENTS</div>
            <div className="space-y-3">{riskScore.contributions.map((factor) => <div key={factor.key} className="grid grid-cols-[95px_1fr_56px] items-center gap-3">
              <span className="text-[10px] text-[#a6b0b0]">{factor.label}</span>
              <div className="h-1.5 overflow-hidden rounded-sm bg-[#252d30]"><div className="h-full rounded-sm bg-[#a9ca6c]" style={{ width: `${factor.valuePct}%` }} /></div>
              <span className="mono text-right text-[10px] text-[#ccd4cb]">{factor.valuePct}%</span>
            </div>)}</div>
            <div className="mt-4 text-[9px] text-[#667175]">Factor weight is encoded in the composite score; bars show each factor value.</div>
          </div>
        </article>
        {whyOpen === 'risk-score' && <WhyPanel title="HOW IS THIS SCORE WEIGHTED?" onClose={() => setWhyOpen(null)}>
          {scenario.consensus.confidence.toLowerCase()} confidence consensus, {scenario.risk.severityPct}% severity, {scenario.exposures.length} linked business units and {scenario.risk.confidencePct}% risk confidence combine into a weighted score of {riskScore.score}. Model factor weights: {riskScore.contributions.map((factor) => `${factor.label} ${factor.weightPct}%`).join(', ')}.
        </WhyPanel>}
        <TogglePanel title="Risk score calculation" hint="Inspect normalized factors and their model weights" testId="toggle-score-breakdown">
          <dl className="grid gap-x-6 sm:grid-cols-2">
            {riskScore.contributions.map((factor) => <DefinitionRow key={factor.key} label={`${factor.label} factor`}>{(factor.valuePct / 100).toFixed(2)} <span className="ml-2 text-[#738084]">· weight {factor.weightPct}%</span></DefinitionRow>)}
            <DefinitionRow label="Composite risk score">{riskScore.score} / 100 · {riskScore.level}</DefinitionRow>
          </dl>
          <p className="mt-2 text-[10px] leading-5 text-[#778286]">Frontend mock calculation only. A future risk service can replace this typed model without changing the presentation contract.</p>
        </TogglePanel>
      </section>

      <section id="impact" className="mb-12 scroll-mt-5">
        <SectionHeading eyebrow="07 / FINANCIAL CONSEQUENCE" title="Potential dollar impact"
          detail="Illustrative scenario model—not actual financial exposure, loss, or a forecast for JPMorgan."
          action={<div className="flex items-center gap-2"><button type="button" onClick={() => setLocation('/impact/IMP-FED-RATE-CUT')} className="inline-flex items-center gap-1 rounded border border-[#596440] bg-[#171d15] px-2 py-1 text-[10px] text-[#b8f34a] hover:bg-[#20291a]">Quantitative Model →</button><WhyButton label="Dollar impact" onClick={() => showWhy('dollar-impact')} /></div>} />
        <article className="relative overflow-hidden rounded-[9px] border border-[#596440] bg-[#151a14]">
          <div className="absolute right-0 top-0 h-full w-[34%] border-l border-[#30382a] bg-[#171c15]" />
          <div className="relative grid gap-7 p-5 sm:p-7 xl:grid-cols-[.82fr_1.18fr]">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded border border-[#57563b] bg-[#211f16] px-2 py-1 text-[9px] font-semibold tracking-[.12em] text-[#cbc28f]"><Sparkles size={11} /> ILLUSTRATIVE MODEL OUTPUT</div>
              <div className="mt-5 text-[9px] font-semibold tracking-[.13em] text-[#899286]">SELECTED SCENARIO · {impactLabels[impactCase].toUpperCase()}</div>
              <div className="mono mt-2 text-[47px] leading-none tracking-[-.07em] text-[#d8f0a6] sm:text-[58px]">{money(selectedImpact)}</div>
              <p className="mt-3 max-w-md text-[11px] leading-5 text-[#9ba596]">Scenario amount is an illustrative modeled impact associated with the event and mapped exposure. It is not an observed loss or disclosed company position.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(['base', 'downside', 'severe', 'expected'] as ImpactCase[]).map((key) => <button key={key} type="button" onClick={() => setImpactCase(key)} aria-pressed={impactCase === key} data-testid={`impact-scenario-${key}`}
                  className={`rounded border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${impactCase === key ? 'border-[#879c58] bg-[#20291a] text-[#d9efb4]' : 'border-[#343c34] bg-[#141914] text-[#929d8e] hover:border-[#69794c]'}`}>
                  <span className="block text-[9px]">{impactLabels[key]}</span><span className="mono mt-1 block text-[12px]">{money(impactValue(scenario, key))}</span>
                </button>)}
              </div>
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between gap-3"><div className="text-[10px] font-semibold tracking-[.12em] text-[#a1ab9b]">SCENARIO RANGE</div><div className="mono text-[9px] text-[#747f75]">$0 — {money(scenario.impact.rangeMaxUsdM)}</div></div>
              <div className="space-y-4 rounded border border-[#30392e] bg-[#101511] p-4 sm:p-5">
                {(['base', 'downside', 'severe', 'expected'] as ImpactCase[]).map((key) => {
                  const value = impactValue(scenario, key);
                  const isSelected = impactCase === key;
                  return <button key={key} type="button" onClick={() => setImpactCase(key)} aria-pressed={isSelected} data-testid={`impact-range-${key}`}
                    className="group block w-full rounded p-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]">
                    <span className="mb-1.5 flex items-center justify-between text-[10px]"><span className={isSelected ? 'text-[#d8e9ba]' : 'text-[#929b91]'}>{impactLabels[key]}</span><span className={`mono ${isSelected ? 'text-[#d5efa4]' : 'text-[#adb7a8]'}`}>{money(value)}</span></span>
                    <span className="block h-2 overflow-hidden rounded-sm bg-[#29302a]"><span className={`block h-full rounded-sm transition-transform ${isSelected ? 'bg-[#b8e878]' : 'bg-[#778c54]'}`} style={{ width: `${Math.min(100, value / scenario.impact.rangeMaxUsdM * 100)}%` }} /></span>
                  </button>;
                })}
                <div className="flex justify-between border-t border-[#2a332b] pt-2 text-[9px] text-[#667269]"><span>Range low</span><span>Modeled impact ↑</span><span>Range high</span></div>
              </div>
              <div className="mt-4 rounded border border-[#3b4633] bg-[#151c13] p-3">
                <div className="text-[9px] font-semibold tracking-[.12em] text-[#a5bb82]">{impactLabels[impactCase].toUpperCase()} INTERPRETATION</div>
                <p className="mt-1.5 text-[10px] leading-5 text-[#a1ac99]">{impactCase === 'base' ? 'A lower-severity path assumes the event has a contained effect on mapped business activity.' : impactCase === 'downside' ? 'A downside path applies the scenario assumptions to modeled exposure; use it as a stress-oriented planning figure.' : impactCase === 'severe' ? 'A severe path represents a more adverse combination of event effects and business transmission.' : 'Expected impact is a probability-weighted model output intended as a planning reference, not an accounting estimate.'}</p>
              </div>
            </div>
          </div>
          {whyOpen === 'dollar-impact' && <div className="relative px-5 pb-5 sm:px-7"><WhyPanel title="WHERE DOES THIS NUMBER COME FROM?" onClose={() => setWhyOpen(null)}>The selected {impactLabels[impactCase].toLowerCase()} is {money(selectedImpact)} from the scenario model. The transparent factor calculation below gives {money(impactCalculation.impactUsdM)} using canonical probability × {money(impactCalculation.exposureUsdM)} exposure basis × {impactCalculation.scenarioMagnitudePct}% scenario magnitude. These are separate illustrative model outputs, not actual financial figures.</WhyPanel></div>}
          <div className="relative border-t border-[#30382b] bg-[#111611] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-[10px] font-semibold tracking-[.13em] text-[#d1d8c7]">IMPACT CALCULATION</div><p className="mt-1 text-[10px] text-[#788378]">A mock formula designed to be replaced by a backend model.</p></div>
              <button type="button" onClick={() => showWhy('dollar-impact')} className="text-[10px] text-[#b7d286] hover:text-[#d7efab] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="impact-calculation-why">Why this calculation?</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
              <CalculationTerm label="EVENT PROBABILITY" value={`${impactCalculation.probabilityPct.toFixed(1)}%`} />
              <span className="text-center text-[#72816a]">×</span>
              <CalculationTerm label="EXPOSURE BASIS" value={money(impactCalculation.exposureUsdM)} />
              <span className="text-center text-[#72816a]">×</span>
              <CalculationTerm label="SCENARIO MAGNITUDE" value={`${impactCalculation.scenarioMagnitudePct}%`} />
              <ArrowRight className="hidden text-[#869575] sm:block" size={15} />
              <CalculationTerm label="CALCULATED IMPACT" value={money(impactCalculation.impactUsdM)} accent />
            </div>
            <div className="mt-3 text-[9px] leading-4 text-[#657066]">Formula: {impactCalculation.probabilityPct.toFixed(1)}% × {money(impactCalculation.exposureUsdM)} × {impactCalculation.scenarioMagnitudePct}% = {money(impactCalculation.impactUsdM)}. Selected scenario: {money(selectedImpact)}.</div>
          </div>
        </article>
      </section>

      <section className="mb-12">
        <SectionHeading eyebrow="EVIDENCE & MODEL AUDIT" title="Calculation provenance"
          detail="Trace the inputs behind consensus, risk and impact without crowding the executive view."
          action={
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setLocation(`/events/${encodeURIComponent(scenario.canonicalEvent.id)}`)} className="inline-flex items-center gap-1 text-[10px] text-[#b8f34a] hover:underline" data-testid="view-event-resolution">
                <span>View event resolution →</span>
              </button>
              <button type="button" onClick={() => setActiveDrawer('provenance')} className="inline-flex items-center gap-1.5 text-[10px] text-[#b9d783] hover:text-[#d8f1a7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="view-provenance">Open provenance <ArrowUpRight size={12} /></button>
            </div>
          } />
        <div className="panel grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          <div className="flex items-start gap-3"><Layers3 size={14} className="mt-0.5 text-[#9eb56e]" /><div><div className="text-[9px] font-semibold tracking-[.12em] text-[#7c8787]">SOURCE SET</div><div className="mt-1.5 text-[11px] text-[#bbc4c1]">{scenario.provenance.sourceSummary.join(' · ')}</div></div></div>
          <div className="flex items-start gap-3"><FileCheck2 size={14} className="mt-0.5 text-[#9eb56e]" /><div><div className="text-[9px] font-semibold tracking-[.12em] text-[#7c8787]">SNAPSHOT</div><div className="mt-1.5 text-[11px] text-[#bbc4c1]">{scenario.provenance.snapshotAvailable ? 'Available' : 'Not available'} · {scenario.provenance.calculatedAt}</div></div></div>
          <div className="flex items-start gap-3"><SlidersHorizontal size={14} className="mt-0.5 text-[#9eb56e]" /><div><div className="text-[9px] font-semibold tracking-[.12em] text-[#7c8787]">MODEL / ENGINE</div><div className="mt-1.5 mono text-[11px] text-[#bbc4c1]">{scenario.provenance.modelVersion} / {scenario.provenance.engineVersion}</div></div></div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading eyebrow="EXECUTIVE TAKEAWAY" title="Exogen intelligence summary" detail="The short version, with technical evidence available above when needed." />
        <article className="panel overflow-hidden">
          <div className="grid md:grid-cols-2">
            <SummaryCell label="WHAT CHANGED" icon={<TrendingUp size={13} />}>{scenario.summary.changed}</SummaryCell>
            <SummaryCell label="WHY IT MATTERS" icon={<Activity size={13} />}>{scenario.summary.whyItMatters}</SummaryCell>
            <SummaryCell label="WHAT IS EXPOSED" icon={<Building2 size={13} />}>{scenario.summary.whatIsExposed} Total unit allocation: {totalExposureLabel}.</SummaryCell>
            <SummaryCell label="RISK / CONFIDENCE" icon={<ShieldAlert size={13} />}><strong className={scoreTone}>{riskScore.score} / 100 — {riskScore.level}</strong><span className="mx-2 text-[#5e6868]">·</span>{scenario.summary.confidence} confidence</SummaryCell>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#283133] bg-[#101516] px-4 py-4 sm:px-5">
            <div><div className="text-[9px] font-semibold tracking-[.13em] text-[#788385]">POTENTIAL IMPACT</div><div className="mono mt-1 text-[18px] text-[#c6e78e]">{money(scenario.impact.downsideUsdM)} <span className="text-[10px] text-[#8e998f]">downside scenario · illustrative</span></div></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => scrollTo('risk')} className="rounded border border-[#333e40] px-3 py-2 text-[10px] text-[#b8c1bd] hover:border-[#839650] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="summary-view-propagation">View propagation →</button>
              <button type="button" onClick={() => scrollTo('risk')} className="rounded border border-[#333e40] px-3 py-2 text-[10px] text-[#b8c1bd] hover:border-[#839650] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="summary-related-risks">View related risks →</button>
              <button type="button" onClick={() => setWatchlisted((current) => !current)} aria-pressed={watchlisted} className={`rounded border px-3 py-2 text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${watchlisted ? 'border-[#70834a] bg-[#1d2617] text-[#c9e895]' : 'border-[#333e40] text-[#b8c1bd] hover:border-[#839650] hover:text-white'}`} data-testid="summary-watchlist">{watchlisted ? '✓ Added to watchlist' : 'Add to watchlist →'}</button>
            </div>
          </div>
        </article>
      </section>

      <section className="mb-7">
        <SectionHeading eyebrow="SIGNATURE VIEW" title="Full intelligence chain" detail="One traceable path from external signal to modeled financial consequence." />
        <div className="soft-scrollbar overflow-x-auto rounded border border-[#2c3537] bg-[#101516] p-4 sm:p-5">
          <div className="flex min-w-[900px] items-stretch">
            {[
              { id: 'signal', label: 'SIGNAL', value: `${scenario.signal.probabilityPct.toFixed(1)}%`, note: scenario.signal.source },
              { id: 'contract', label: 'CONTRACT', value: scenario.contracts[0]?.venue ?? '—', note: scenario.contracts[0]?.id ?? '' },
              { id: 'event', label: 'CANONICAL EVENT', value: `${scenario.canonicalEvent.identityConfidencePct.toFixed(1)}%`, note: scenario.canonicalEvent.id },
              { id: 'consensus', label: 'CONSENSUS', value: `${scenario.consensus.probabilityPct.toFixed(1)}%`, note: `${scenario.consensus.venues.length} venues` },
              { id: 'risk', label: 'RISK', value: scenario.risk.name, note: `${scenario.risk.relationship.toLowerCase()} · ${scenario.risk.direction.toLowerCase()}` },
              { id: 'exposure', label: 'EXPOSURE', value: totalExposureLabel, note: `${scenario.exposures.length} units · mock` },
              { id: 'score', label: 'RISK SCORE', value: `${riskScore.score} / 100`, note: riskScore.level },
              { id: 'impact', label: 'IMPACT', value: money(scenario.impact.downsideUsdM), note: 'Downside · illustrative' },
            ].map((node, index, all) => <div className="flex flex-1 items-center" key={node.id}>
              <button type="button" onClick={() => scrollTo(node.id)} data-testid={`chain-${node.id}`}
                className={`flex min-h-[94px] min-w-0 flex-1 flex-col justify-center rounded border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a] ${index === all.length - 1 ? 'border-[#697a4a] bg-[#1a2116]' : 'border-[#303a3b] bg-[#141a1b] hover:border-[#687a49]'}`}>
                <span className="text-[8px] font-semibold tracking-[.13em] text-[#7e8989]">{node.label}</span>
                <span className={`mono mt-2 truncate text-[14px] font-medium ${index === all.length - 1 ? 'text-[#c8e992]' : 'text-[#d8dfd8]'}`}>{node.value}</span>
                <span className="mt-1 truncate text-[8px] text-[#778182]">{node.note}</span>
              </button>
              {index < all.length - 1 && <div className="flex w-6 shrink-0 items-center justify-center text-[#82906d]"><ArrowRight size={13} /></div>}
            </div>)}
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#222b2d] pt-4 text-[9px] text-[#636f72]">
        <span>Illustrative demo intelligence · Not investment advice or a representation of actual JPMorgan exposure.</span>
        <button type="button" onClick={() => setActiveDrawer('technical')} className="inline-flex items-center gap-1 hover:text-[#b8d783] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid="open-technical-drawer">Technical audit <ArrowUpRight size={10} /></button>
      </div>

      <DetailDrawer open={activeDrawer === 'contract'} title="Matched contract detail" eyebrow="SOURCE CONTRACT" onClose={() => setActiveDrawer(null)} testId="contract-detail-drawer">
        {activeContract && <ContractDrawerContent contract={activeContract} />}
      </DetailDrawer>
      <DetailDrawer open={activeDrawer === 'provenance'} title="Calculation provenance" eyebrow="TRACEABLE INPUTS" onClose={() => setActiveDrawer(null)} testId="provenance-drawer">
        <ProvenanceContent scenario={scenario} riskScore={riskScore.score} totalExposure={totalExposure} impactValue={selectedImpact} impactLabel={impactLabels[impactCase]} />
      </DetailDrawer>
      <DetailDrawer open={activeDrawer === 'technical'} title="Technical details" eyebrow="ADVANCED / MODEL INPUTS" onClose={() => setActiveDrawer(null)} testId="technical-drawer">
        <TechnicalContent scenario={scenario} riskScore={riskScore.score} />
      </DetailDrawer>
    </main>
  );
}

function ExposureCard({ exposure, onClick, isOpen, onClose }: { exposure: BusinessUnitExposure; onClick: () => void; isOpen: boolean; onClose: () => void }) {
  return (
    <article className="panel group p-4 transition-colors hover:border-[#3b4743]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="text-[13px] font-medium leading-5 text-[#d9dfd9]">{exposure.name}</div>
        <span className={`shrink-0 rounded border px-1.5 py-1 text-[8px] font-semibold tracking-[.09em] ${transmissionClass(exposure.transmission)}`}>{exposure.transmission}</span>
      </div>
      <div className="mono text-[25px] leading-none tracking-[-.05em] text-[#e4e9e0]">{money(exposure.amountUsdM)}</div>
      <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[#2b3335] pt-3">
        <div><div className="text-[8px] tracking-[.12em] text-[#737e81]">SENSITIVITY</div><div className="mt-1 text-[10px] text-[#b6c0bd]">{exposure.sensitivity}</div></div>
        <div><div className="text-[8px] tracking-[.12em] text-[#737e81]">CONFIDENCE</div><div className="mono mt-1 text-[10px] text-[#b6c0bd]">{exposure.confidencePct}%</div></div>
        <div className="col-span-2"><div className="text-[8px] tracking-[.12em] text-[#737e81]">IMPACT DIRECTION</div><div className={`mt-1 text-[10px] ${directionClass(exposure.direction)}`}>{directionText(exposure.direction)}</div></div>
      </div>
      <button type="button" onClick={onClick} className="mt-3 inline-flex min-h-7 items-center gap-1 text-[9px] text-[#8fa079] hover:text-[#c7e590] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8f34a]" data-testid={`exposure-why-${exposure.id}`}>How is this exposed? <ArrowUpRight size={10} /></button>
      {isOpen && <WhyPanel title={`${exposure.name.toUpperCase()} MAPPING`} onClose={onClose}>{exposure.explanation} This {exposure.transmission.toLowerCase()} path is assigned {money(exposure.amountUsdM)} of illustrative exposure at {exposure.confidencePct}% confidence.</WhyPanel>}
    </article>
  );
}

function CalculationTerm({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className={`rounded border px-3 py-3 ${accent ? 'border-[#53623c] bg-[#1a2117]' : 'border-[#2d3632] bg-[#141a15]'}`}><div className="text-[8px] font-semibold tracking-[.11em] text-[#819080]">{label}</div><div className={`mono mt-2 text-[14px] ${accent ? 'text-[#c6e98b]' : 'text-[#d9dfd3]'}`}>{value}</div></div>;
}

function SummaryCell({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return <div className="min-h-[112px] border-b border-[#283133] p-4 last:border-b-0 md:odd:border-r md:odd:border-r-[#283133] md:even:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0 sm:p-5">
    <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold tracking-[.13em] text-[#7f8a8c]">{icon}{label}</div><div className="text-[11px] leading-5 text-[#b0b9b6]">{children}</div>
  </div>;
}

function ContractDrawerContent({ contract }: { contract: Contract }) {
  return <div>
    <p className="mb-4 text-[13px] leading-6 text-[#d8dfd9]">{contract.question}</p>
    <div className="mb-4 grid grid-cols-2 gap-2">
      <div className="rounded border border-[#2d3739] bg-[#141a1c] p-3"><div className="text-[8px] tracking-[.12em] text-[#758185]">VENUE</div><div className="mt-1 text-[12px] text-[#d4dcda]">{contract.venue}</div></div>
      <div className="rounded border border-[#2d3739] bg-[#141a1c] p-3"><div className="text-[8px] tracking-[.12em] text-[#758185]">MATCH SCORE</div><div className="mono mt-1 text-[12px] text-[#bde47d]">{contract.matchScorePct}%</div></div>
    </div>
    <dl>
      <DefinitionRow label="Contract ID" mono>{contract.id}</DefinitionRow>
      <DefinitionRow label="Market ID" mono>{contract.marketId}</DefinitionRow>
      <DefinitionRow label="Outcome / probability">{contract.outcome} · {contract.probabilityPct.toFixed(1)}%</DefinitionRow>
      <DefinitionRow label="Liquidity / volume">{money(contract.liquidityUsdM)} / {money(contract.volumeUsdM)}</DefinitionRow>
      <DefinitionRow label="Freshness">{contract.freshness}</DefinitionRow>
      <DefinitionRow label="Fingerprint" mono>{contract.fingerprint}</DefinitionRow>
      <DefinitionRow label="Resolution source">{contract.resolutionSource}</DefinitionRow>
      <DefinitionRow label="Resolution semantics">{contract.resolutionSemantics}</DefinitionRow>
      <DefinitionRow label="Oracle compatibility">{contract.oracleCompatible ? 'Compatible' : 'Needs semantic review'}</DefinitionRow>
      <DefinitionRow label="Source URL" mono>{contract.sourceUrl}</DefinitionRow>
    </dl>
    <div className="mt-5 rounded border border-[#2d3739] bg-[#141a1c] p-4">
      <div className="mb-2 text-[9px] font-semibold tracking-[.12em] text-[#8d9a9d]">MATCH FEATURES</div>
      <ul className="space-y-2">{contract.matchFeatures.map((feature) => <li key={feature} className="flex gap-2 text-[10px] leading-4 text-[#aab5b5]"><span className="text-[#adc77e]">•</span>{feature}</li>)}</ul>
    </div>
    <p className="mt-4 text-[9px] leading-5 text-[#687579]">Contract records are bundled illustrative data. No connection to a venue API is made.</p>
  </div>;
}

function ProvenanceContent({ scenario, riskScore, totalExposure, impactValue: impact, impactLabel }: { scenario: IntelligenceScenario; riskScore: number; totalExposure: number; impactValue: number; impactLabel: string }) {
  return <div>
    <p className="mb-5 text-[11px] leading-5 text-[#899597]">An audit trail for how this demonstration scenario was assembled. Values are mock model inputs.</p>
    <ProvenanceGroup title="SOURCE">{scenario.provenance.sourceSummary.map((source) => <DefinitionRow key={source} label="Venue">{source}</DefinitionRow>)}</ProvenanceGroup>
    <ProvenanceGroup title="MATCHING">
      <DefinitionRow label="Canonical Event ID" mono>{scenario.canonicalEvent.id}</DefinitionRow>
      <DefinitionRow label="Identity confidence">{scenario.canonicalEvent.identityConfidencePct.toFixed(1)}%</DefinitionRow>
      <DefinitionRow label="Matched contracts">{scenario.contracts.length} · {scenario.contracts.map((contract) => contract.id).join(', ')}</DefinitionRow>
    </ProvenanceGroup>
    <ProvenanceGroup title="CONSENSUS">
      <DefinitionRow label="P_M">{scenario.consensus.probabilityPct.toFixed(1)}%</DefinitionRow>
      <DefinitionRow label="ΔP">{scenario.consensus.disagreementPp.toFixed(1)} pp · {scenario.consensus.disagreementLevel.toLowerCase()}</DefinitionRow>
      <DefinitionRow label="Venue weights">{scenario.consensus.venues.map((venue) => `${venue.venue} ${venue.weightPct}%`).join(' · ')}</DefinitionRow>
    </ProvenanceGroup>
    <ProvenanceGroup title="RISK">
      <DefinitionRow label="Risk category">{scenario.risk.name}</DefinitionRow>
      <DefinitionRow label="Relationship">{scenario.risk.relationship}</DefinitionRow>
      <DefinitionRow label="Risk score">{riskScore} / 100</DefinitionRow>
    </ProvenanceGroup>
    <ProvenanceGroup title="EXPOSURE">
      <DefinitionRow label="Business units">{scenario.exposures.length}</DefinitionRow>
      <DefinitionRow label="Modeled exposure">{money(totalExposure)} · illustrative</DefinitionRow>
      <DefinitionRow label="Unit allocation">{scenario.exposures.map((unit) => `${unit.name} ${money(unit.amountUsdM)}`).join(' · ')}</DefinitionRow>
    </ProvenanceGroup>
    <ProvenanceGroup title="IMPACT">
      <DefinitionRow label="Scenario">{impactLabel}</DefinitionRow>
      <DefinitionRow label="Potential impact">{money(impact)} · illustrative</DefinitionRow>
      <DefinitionRow label="Model formula">{scenario.consensus.probabilityPct.toFixed(1)}% × {money(scenario.impact.exposureBasisUsdM)} × {scenario.impact.scenarioMagnitudePct}%</DefinitionRow>
    </ProvenanceGroup>
    <div className="mt-6 border-t border-[#2b3436] pt-4">
      <DefinitionRow label="Last calculated">{scenario.signal.freshness}</DefinitionRow>
      <DefinitionRow label="Data snapshot">{scenario.provenance.snapshotAvailable ? 'Available' : 'Unavailable'}</DefinitionRow>
      <DefinitionRow label="Model version" mono>{scenario.provenance.modelVersion}</DefinitionRow>
      <DefinitionRow label="Engine version" mono>{scenario.provenance.engineVersion}</DefinitionRow>
      <DefinitionRow label="Calculation timestamp" mono>{scenario.provenance.calculatedAt}</DefinitionRow>
    </div>
  </div>;
}

function ProvenanceGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mb-5"><h3 className="mb-2 border-b border-[#2b3436] pb-2 text-[9px] font-semibold tracking-[.14em] text-[#b1c77d]">{title}</h3><dl>{children}</dl></section>;
}

function TechnicalContent({ scenario, riskScore }: { scenario: IntelligenceScenario; riskScore: number }) {
  return <div>
    <p className="mb-5 text-[11px] leading-5 text-[#899597]">Technical identifiers and calculated fields. Matching and risk logic are demonstration-only.</p>
    <dl>
      <DefinitionRow label="Signal ID" mono>{scenario.signal.id}</DefinitionRow>
      <DefinitionRow label="Contract ID" mono>{scenario.contracts[0]?.id}</DefinitionRow>
      <DefinitionRow label="Canonical Event ID" mono>{scenario.canonicalEvent.id}</DefinitionRow>
      <DefinitionRow label="Fingerprint" mono>{scenario.contracts[0]?.fingerprint}</DefinitionRow>
      <DefinitionRow label="Match score">{scenario.contracts[0]?.matchScorePct}%</DefinitionRow>
      <DefinitionRow label="Fellegi–Sunter score">{((scenario.contracts[0]?.fellegiSunterScorePct ?? scenario.contracts[0]?.matchScorePct ?? 0) / 100).toFixed(2)} · illustrative proxy</DefinitionRow>
      <DefinitionRow label="Oracle compatibility">{scenario.contracts.every((contract) => contract.oracleCompatible) ? 'TRUE' : 'PARTIAL — review required'}</DefinitionRow>
      <DefinitionRow label="Venue weights" mono>{scenario.consensus.venues.map((venue) => `${venue.venue}:${venue.weightPct}%`).join(' | ')}</DefinitionRow>
      <DefinitionRow label="Consensus probability">{scenario.consensus.probabilityPct.toFixed(1)}%</DefinitionRow>
      <DefinitionRow label="Delta P">{scenario.consensus.disagreementPp.toFixed(1)} pp</DefinitionRow>
      <DefinitionRow label="Risk score">{riskScore}</DefinitionRow>
      <DefinitionRow label="Exposure model">business-unit illustrative allocation</DefinitionRow>
      <DefinitionRow label="Scenario model">probability × exposure × magnitude</DefinitionRow>
      <DefinitionRow label="Calculated at" mono>{scenario.provenance.calculatedAt}</DefinitionRow>
    </dl>
    <div className="mt-5 rounded border border-[#384041] bg-[#141a1b] p-3 text-[9px] leading-5 text-[#788487]">No backend, database, market integration, real matching engine, or real company exposure model is connected.</div>
  </div>;
}

export { SignalDetailPage, DetailSkeleton as SignalDetailLoadingSkeleton, DetailError as SignalDetailError };