import { useState } from 'react';
import { GitBranch, ArrowRight, Network, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

interface Props {
  onOpenRiskGraph?: () => void;
}

export function ScenarioPropagationFlow({ onOpenRiskGraph }: Props) {
  const [, setLocation] = useLocation();
  const [activeScenario, setActiveScenario] = useState<'BASE' | 'DOWNSIDE' | 'SEVERE'>('DOWNSIDE');

  const scenarioData = {
    BASE: {
      magnitude: '30%',
      impact: '$8.2M',
      transmissionMultiplier: '1.0x',
      steps: [
        { label: 'Event Signal', detail: 'Fed cuts benchmark rate by 50bps' },
        { label: 'Macro Variable', detail: 'Prime rate floats down in line with Fed funds' },
        { label: 'Financial Mechanism', detail: 'Commercial loan coupons reprice after 30-day lag' },
        { label: 'Business Division', detail: 'Commercial Banking absorbs controlled margin compression' },
      ],
    },
    DOWNSIDE: {
      magnitude: '65%',
      impact: '$18.4M',
      transmissionMultiplier: '1.2x',
      steps: [
        { label: 'Event Signal', detail: 'Fed cuts benchmark rate by ≥50bps aggressively' },
        { label: 'Macro Variable', detail: 'Yield curve steepening; short rates plunge rapidly' },
        { label: 'Financial Mechanism', detail: 'Deposit runoff accelerates as institutional cash shifts to repos' },
        { label: 'Business Division', detail: 'Commercial Banking & Markets experience dual NIM erosion' },
      ],
    },
    SEVERE: {
      magnitude: '115%',
      impact: '$31.7M',
      transmissionMultiplier: '1.5x',
      steps: [
        { label: 'Event Signal', detail: 'Emergency inter-meeting 75bps rate cut package' },
        { label: 'Macro Variable', detail: 'Bond market dislocation; acute basis volatility' },
        { label: 'Financial Mechanism', detail: 'MBS prepayments spike violently; hedging slippage' },
        { label: 'Business Division', detail: 'Firmwide Treasury & Markets face cascading cross-BU liquidation' },
      ],
    },
  };

  const current = scenarioData[activeScenario];

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            TRANSMISSION COUPLING
          </span>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Scenario Propagation Network
          </h3>
          <p className="mt-1 text-xs text-[#92989e]">
            Inspect how the macro transmission path adapts when stress magnitude escalates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['BASE', 'DOWNSIDE', 'SEVERE'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveScenario(sc)}
              className={`rounded-md px-3 py-1 text-xs font-mono font-medium transition border ${
                activeScenario === sc
                  ? sc === 'SEVERE'
                    ? 'bg-[#ff5c5c]/10 text-[#ff5c5c] border-[#ff5c5c]/40'
                    : 'bg-[#b8f34a]/10 text-[#b8f34a] border-[#b8f34a]/40'
                  : 'bg-[#171a1d] text-[#92989e] border-[#24282c] hover:text-[#f5f5f2]'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Path Flow */}
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {current.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative rounded-lg border border-[#24282c] bg-[#171a1d] p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#656b70]">
                  <span>STEP 0{idx + 1}</span>
                  <span className="text-[#92989e]">{step.label}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-[#f5f5f2] leading-relaxed">
                  {step.detail}
                </div>
              </div>

              {idx < current.steps.length - 1 && (
                <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-[#656b70]">
                  <ArrowRight className="h-4 w-4 text-[#b8f34a]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Outcome banner */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">SCENARIO MAGNITUDE</div>
              <div className="text-sm font-mono font-bold text-[#7c8cff]">{current.magnitude}</div>
            </div>
            <div className="h-6 w-px bg-[#24282c]" />
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">TRANSMISSION MULTIPLIER</div>
              <div className="text-sm font-mono font-bold text-[#f5f5f2]">{current.transmissionMultiplier}</div>
            </div>
            <div className="h-6 w-px bg-[#24282c]" />
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">ESTIMATED IMPACT</div>
              <div className="text-base font-mono font-bold text-[#b8f34a]">{current.impact}</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onOpenRiskGraph) onOpenRiskGraph();
              else setLocation('/risk-graph');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#b8f34a] hover:underline"
          >
            <Network className="h-3.5 w-3.5" />
            Explore full graph in Risk Graph →
          </button>
        </div>
      </div>
    </div>
  );
}
