import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  GitBranch,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

interface ChainStep {
  id: string;
  stepNumber: string;
  title: string;
  label: string;
  value: string;
  meta: string;
  detail: string;
  path?: string;
  accent?: string;
}

interface Props {
  eventId?: string;
  eventTitle?: string;
  eventProbability?: number;
  riskName?: string;
  riskCategory?: string;
  relationshipType?: string;
  impactDirection?: string;
  transmissionSummary?: string;
  affectedUnits?: string[];
  modeledExposure?: string;
}

export function SignatureRiskChain({
  eventId = 'CE-000184',
  eventTitle = 'Fed cuts ≥50bps',
  eventProbability = 66.1,
  riskName = 'Interest Rate Risk',
  riskCategory = 'Market Risk',
  relationshipType = 'Direct',
  impactDirection = 'Negative',
  transmissionSummary = 'Rate cut → Yield curve steepening → NIM compression → Business economics',
  affectedUnits = ['Commercial Banking', 'Markets', 'Asset Management', 'Consumer Banking'],
  modeledExposure = '$27.8M',
}: Props) {
  const [, setLocation] = useLocation();
  const [selectedStep, setSelectedStep] = useState<string>('relationship');

  const steps: ChainStep[] = [
    {
      id: 'event',
      stepNumber: '01',
      title: 'CANONICAL EVENT',
      label: eventTitle,
      value: `${eventProbability.toFixed(1)}% probability`,
      meta: eventId,
      detail: 'Reconciled cross-venue prediction market consensus derived across Polymarket & Kalshi.',
      path: `/events/${eventId}`,
      accent: 'border-[#b8f34a]/40 bg-[#161d15] text-[#b8f34a]',
    },
    {
      id: 'category',
      stepNumber: '02',
      title: 'RISK CATEGORY',
      label: riskName,
      value: riskCategory,
      meta: 'Taxonomy Tier 1',
      detail: 'Standardized institutional categorization mapping macroeconomic catalysts to balance sheet risk perimeters.',
      path: '/risk/taxonomy',
      accent: 'border-[#798e3b]/40 bg-[#161914] text-[#d6eb99]',
    },
    {
      id: 'relationship',
      stepNumber: '03',
      title: 'RISK RELATIONSHIP',
      label: `${relationshipType} Relationship`,
      value: `${impactDirection} Impact`,
      meta: '87% confidence',
      detail: 'Immediate direct contractual and cash-flow link between the policy event and bank asset repricing.',
      path: '/risk/relationships',
      accent: 'border-[#e58a83]/30 bg-[#1f1515] text-[#f2a19b]',
    },
    {
      id: 'transmission',
      stepNumber: '04',
      title: 'TRANSMISSION PATH',
      label: 'Financial Mechanism',
      value: 'NIM Compression',
      meta: '4-stage path',
      detail: transmissionSummary,
      path: '/risk/transmission',
      accent: 'border-[#2d3a40] bg-[#111719] text-[#9fc1d3]',
    },
    {
      id: 'units',
      stepNumber: '05',
      title: 'BUSINESS UNITS',
      label: 'JPMorgan Chase Units',
      value: `${affectedUnits.length} Units Affected`,
      meta: 'Wholesale & Retail',
      detail: affectedUnits.join(' · '),
      path: '/exposure',
      accent: 'border-[#393424] bg-[#171610] text-[#e8d597]',
    },
    {
      id: 'exposure',
      stepNumber: '06',
      title: 'MODELED EXPOSURE',
      label: 'Financial Downside',
      value: modeledExposure,
      meta: 'Illustrative Model',
      detail: 'Allocated business-unit sensitivity under a cumulative 50 basis points benchmark rate decline.',
      path: '/exposure',
      accent: 'border-[#b8f34a]/60 bg-[#1a2318] text-[#b8f34a]',
    },
  ];

  const activeStep = steps.find((s) => s.id === selectedStep) || steps[2];

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              EXOGEN SIGNATURE RISK CHAIN
            </span>
          </div>
          <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
            Event → Risk → Transmission → Business Unit → Exposure
          </h2>
          <p className="mt-1 text-[12px] text-[#8c979d]">
            Exogen does not merely forecast what may happen. It traces how external events propagate directly into JPMorgan Chase’s business units.
          </p>
        </div>

        <span className="mono rounded border border-[#273223] bg-[#162015] px-2.5 py-1 text-[10px] text-[#b8f34a]">
          JPMorgan Chase Demo Model
        </span>
      </div>

      {/* 6-Node Horizontal Interactive Chain */}
      <div className="mt-6 overflow-x-auto pb-3">
        <div className="flex min-w-[940px] items-stretch gap-2">
          {steps.map((step, idx) => {
            const isSelected = selectedStep === step.id;
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setSelectedStep(step.id)}
                  className={`group relative flex h-full w-full flex-col justify-between rounded-[6px] border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-[#b8f34a]/80 bg-[#161d16] shadow-[0_0_14px_rgba(184,243,74,0.08)]'
                      : 'border-[#22272b] bg-[#121517] hover:border-[#384147] hover:bg-[#15191c]'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute -top-1 left-3 h-[2px] w-6 bg-[#b8f34a]" />
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="mono text-[8px] font-semibold tracking-[.1em] text-[#636e74]">
                        STAGE {step.stepNumber}
                      </span>
                      <span className="mono text-[9px] text-[#869298]">{step.meta}</span>
                    </div>

                    <div className="mt-2 text-[9px] font-semibold tracking-[.12em] text-[#8c979c]">
                      {step.title}
                    </div>
                    <div className="mt-1 line-clamp-1 text-[12px] font-medium text-[#edf0ec]">
                      {step.label}
                    </div>
                    <div className="mono mt-1 text-[11px] font-semibold text-[#b8f34a]">
                      {step.value}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#1e2326] pt-2 text-[9px] text-[#6a7479]">
                    <span>{isSelected ? 'Inspecting' : 'Click to inspect'}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 text-[#b8f34a]">→</span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="flex shrink-0 px-1 text-[#384146]">
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Deep Dive Drawer */}
      <div className="mt-4 rounded-[6px] border border-[#242b2f] bg-[#0d1012] p-4 text-[11px]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1d2225] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="mono rounded bg-[#172016] px-2 py-0.5 text-[9px] font-semibold text-[#b8f34a]">
              STAGE {activeStep.stepNumber} DETAIL
            </span>
            <span className="font-semibold text-[#edf1ec]">{activeStep.title}</span>
            <span className="text-[#6d777d]">·</span>
            <span className="text-[#9ea8ad]">{activeStep.label}</span>
          </div>

          {activeStep.path && (
            <button
              type="button"
              onClick={() => setLocation(activeStep.path!)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#b8f34a] hover:underline"
            >
              <span>Explore workspace view</span>
              <ArrowRight size={11} />
            </button>
          )}
        </div>

        <p className="mt-2.5 max-w-4xl text-[12px] leading-relaxed text-[#9ba5ab]">
          {activeStep.detail}
        </p>

        {activeStep.id === 'transmission' && (
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <span className="rounded bg-[#171b1e] px-2.5 py-1 text-[#c7cecb]">Fed Rate Cut</span>
            <span className="text-[#596469]">→</span>
            <span className="rounded bg-[#171b1e] px-2.5 py-1 text-[#c7cecb]">Short-term Rates</span>
            <span className="text-[#596469]">→</span>
            <span className="rounded bg-[#171b1e] px-2.5 py-1 text-[#c7cecb]">Deposit / Loan Pricing</span>
            <span className="text-[#596469]">→</span>
            <span className="rounded bg-[#171b1e] px-2.5 py-1 text-[#c7cecb]">Net Interest Margin</span>
            <span className="text-[#596469]">→</span>
            <span className="rounded bg-[#1e271c] px-2.5 py-1 text-[#b8f34a]">Commercial Banking ($6.8M)</span>
          </div>
        )}
      </div>
    </article>
  );
}
