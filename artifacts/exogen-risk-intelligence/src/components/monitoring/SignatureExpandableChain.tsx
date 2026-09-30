import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Sparkles,
  ShieldAlert,
  GitBranch,
  BriefcaseBusiness,
  SlidersHorizontal,
  DollarSign,
  AlertTriangle,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
} from 'lucide-react';

export function SignatureExpandableChain() {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const steps = [
    {
      id: 1,
      tag: 'STEP 01 · EXTERNAL EVENT',
      title: 'Federal Reserve Rate Cut ≥50bps',
      metric: '66.1% P_M',
      delta: '+24.1pp in 4h',
      deltaType: 'up',
      detail: 'Core PCE release triggered cross-venue prediction consensus jump across Polymarket and Kalshi contracts.',
      linkPath: '/events/CE-000184',
      linkLabel: 'Inspect Canonical Event',
    },
    {
      id: 2,
      tag: 'STEP 02 · CAUSAL RISK MAPPING',
      title: 'Interest Rate Risk',
      metric: '78 / 100',
      delta: 'HIGH TIER (+27 pts)',
      deltaType: 'up',
      detail: 'Direct causal relationship verified with 87% confidence against Federal Reserve H.15 statutory oracle.',
      linkPath: '/risk/scores/RS-FED-RATE-CUT',
      linkLabel: 'View Risk Score Detail',
    },
    {
      id: 3,
      tag: 'STEP 03 · NETWORK PROPAGATION',
      title: 'Net Interest Margin Repricing',
      metric: 'Depth 2',
      delta: '16 min velocity',
      deltaType: 'neutral',
      detail: 'Floating-rate prime business loan coupons reprice downward while deposit betas lag in high competition.',
      linkPath: '/risk/propagation/PROP-FED-RATE-CUT',
      linkLabel: 'Trace Transmission Path',
    },
    {
      id: 4,
      tag: 'STEP 04 · EXPOSURE SYNTHESIS',
      title: 'Commercial Banking & Markets',
      metric: '$27.8M',
      delta: '+$13.6M revision',
      deltaType: 'up',
      detail: 'EXP-00072 balance sheet mapping attributes $6.8M to Commercial Banking and $5.1M to Fixed Income trading books.',
      linkPath: '/exposure/business-unit/BU-COMM-BANK',
      linkLabel: 'Inspect BU Exposure',
    },
    {
      id: 5,
      tag: 'STEP 05 · SCENARIO SPECIFICATION',
      title: 'Downside Stress Scenario',
      metric: '65% Magnitude',
      delta: 'Assumed repricing lag',
      deltaType: 'neutral',
      detail: 'Calibrated under moderate macroeconomic easing friction and institutional corporate cash reallocation.',
      linkPath: '/impact/scenarios',
      linkLabel: 'Open Scenario Engine',
    },
    {
      id: 6,
      tag: 'STEP 06 · POTENTIAL DOLLAR IMPACT',
      title: 'Modeled Downside Impact',
      metric: '$18.4M',
      delta: '+$10.4M vs baseline',
      deltaType: 'up',
      detail: 'Illustrative transparent calculation chain: 66.1% P_M × $27.8M exposure × 65% magnitude × 1.0x transmission.',
      linkPath: '/impact/IMP-FED-RATE-CUT',
      linkLabel: 'Inspect Dollar Impact',
    },
    {
      id: 7,
      tag: 'STEP 07 · EARLY WARNING TRIGGER',
      title: 'High Significance Warning',
      metric: 'HIGH',
      delta: 'Triggered 12m ago',
      deltaType: 'alert',
      detail: 'Automated monitoring rule RULE-PROB-ACCEL activated due to probability delta exceeding 10.0pp hurdle.',
      linkPath: '/early-warnings/WARN-FED-RATE-CUT',
      linkLabel: 'Investigate Early Warning',
    },
    {
      id: 8,
      tag: 'STEP 08 · PERSISTENT WATCHLIST',
      title: 'JPMorgan Executive Monitoring',
      metric: 'ACTIVE',
      delta: 'Alert Rule Active (>75)',
      deltaType: 'neutral',
      detail: 'Monitored continuously across 5 core enterprise risk dimensions with deduplicated alert notification.',
      linkPath: '/watchlist',
      linkLabel: 'View Watchlist Entry',
    },
  ];

  return (
    <div className="rounded-xl border border-[#b8f34a]/30 bg-[#111416] p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#b8f34a]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              SIGNATURE EXOGEN CHAIN · END-TO-END INTELLIGENCE FLOW
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            External Change to Enterprise Consequence
          </h2>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3 py-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2]"
        >
          {isExpanded ? 'Collapse Flow' : 'Expand Flow'}
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-6">
          <p className="text-xs text-[#92989e] leading-relaxed">
            Click any transition node to inspect how an external world shift automatically propagates, quantifies, and alerts the enterprise:
          </p>

          {/* Interactive Chain Nodes Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {steps.map((step) => {
              const isSelected = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`rounded-lg border p-2.5 text-left transition ${
                    isSelected
                      ? 'border-[#b8f34a] bg-[#b8f34a]/10 ring-1 ring-[#b8f34a]'
                      : 'border-[#24282c] bg-[#171a1d] hover:border-[#3b4440]'
                  }`}
                >
                  <div className="text-[8px] font-mono text-[#656b70] truncate">{step.tag}</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#f5f5f2] truncate">
                    {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                  </div>
                  <div className="mt-1 text-xs font-mono font-bold text-[#b8f34a]">{step.metric}</div>
                </button>
              );
            })}
          </div>

          {/* Active Node Detail Card */}
          {(() => {
            const current = steps[activeStep - 1] || steps[0];

            return (
              <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#b8f34a]">
                      {current.tag}
                    </span>
                    <span className="rounded bg-[#171a1d] px-1.5 py-0.2 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
                      {current.delta}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#f5f5f2]">{current.title}</h3>
                  <p className="text-xs text-[#92989e] leading-relaxed">{current.detail}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setLocation(current.linkPath)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#a6e03b] transition"
                  >
                    {current.linkLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
