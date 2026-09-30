import { ArrowDown, HelpCircle, Layers, Sparkles, SlidersHorizontal } from 'lucide-react';

interface Props {
  probabilityPct: number;
  modeledExposureUsdM: number;
  scenarioMagnitudePct: number;
  potentialImpactUsdM: number;
  scenarioName: string;
  onOpenDetails?: () => void;
  onOpenScenarios?: () => void;
}

export function ImpactCalculationChain({
  probabilityPct,
  modeledExposureUsdM,
  scenarioMagnitudePct,
  potentialImpactUsdM,
  scenarioName,
  onOpenDetails,
  onOpenScenarios,
}: Props) {
  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              TRANSPARENT VALUE CHAIN
            </span>
            <span className="rounded bg-[#7c8cff]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#7c8cff]">
              ILLUSTRATIVE FRAMEWORK
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Impact Calculation Chain
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {onOpenScenarios && (
            <button
              onClick={onOpenScenarios}
              className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Scenario Engine
            </button>
          )}
          {onOpenDetails && (
            <button
              onClick={onOpenDetails}
              className="inline-flex items-center gap-1.5 text-xs text-[#b8f34a] hover:underline"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Inspect Calculation
            </button>
          )}
        </div>
      </div>

      {/* Visual Chain Flow */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Step 1: Probability */}
        <div className="w-full md:w-1/4 rounded-lg border border-[#24282c] bg-[#171a1d] p-4 text-center">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            MARKET PROBABILITY
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-[#f5f5f2]">
            {probabilityPct.toFixed(1)}%
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#656b70]">
            Volume-weighted consensus
          </div>
        </div>

        <div className="text-xl font-mono text-[#656b70] select-none">×</div>

        {/* Step 2: Exposure */}
        <div className="w-full md:w-1/4 rounded-lg border border-[#24282c] bg-[#171a1d] p-4 text-center">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            MODELED EXPOSURE
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-[#f5f5f2]">
            ${modeledExposureUsdM.toFixed(1)}M
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#656b70]">
            EXP-00072 (4 Business Units)
          </div>
        </div>

        <div className="text-xl font-mono text-[#656b70] select-none">×</div>

        {/* Step 3: Scenario Magnitude */}
        <div className="w-full md:w-1/4 rounded-lg border border-[#24282c] bg-[#171a1d] p-4 text-center">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            SCENARIO MAGNITUDE
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-[#7c8cff]">
            {scenarioMagnitudePct}%
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#656b70]">
            {scenarioName}
          </div>
        </div>

        <div className="text-xl font-mono text-[#b8f34a] select-none">↓</div>

        {/* Step 4: Potential Impact */}
        <div className="w-full md:w-1/3 rounded-lg border border-[#b8f34a]/40 bg-[#b8f34a]/5 p-4 text-center shadow-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
            POTENTIAL DOLLAR IMPACT
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#b8f34a]">
            ${potentialImpactUsdM.toFixed(1)}M
          </div>
          <div className="mt-1 text-[10px] font-mono text-[#92989e]">
            Reflects 1.0x transmission multiplier
          </div>
        </div>
      </div>

      <div className="mt-4 rounded border border-[#24282c] bg-[#0a0a0b]/60 px-4 py-2 text-[11px] text-[#656b70] flex items-center justify-between">
        <span>Illustrative calculation framework — v0.1. Real calculation model will connect to institutional risk engine.</span>
        <span className="font-mono text-[#92989e]">CALCULATED 2M AGO</span>
      </div>
    </div>
  );
}
