import { useState } from 'react';
import { HelpCircle, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { ImpactRange } from '@/types/quantitative-intelligence';

interface Props {
  range: ImpactRange;
  modeledImpactUsdM: number;
}

export function ImpactRangeVisualizer({ range, modeledImpactUsdM }: Props) {
  const [showReason, setShowReason] = useState(false);

  const getConfidenceBadge = (conf: string) => {
    switch (conf) {
      case 'HIGH':
        return 'bg-[#b8f34a]/10 text-[#b8f34a] border-[#b8f34a]/30';
      case 'MEDIUM':
        return 'bg-[#7c8cff]/10 text-[#7c8cff] border-[#7c8cff]/30';
      default:
        return 'bg-[#ff5c5c]/10 text-[#ff5c5c] border-[#ff5c5c]/30';
    }
  };

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            UNCERTAINTY & SPREAD
          </span>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Modeled Impact Range & Confidence
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#92989e]">Estimate Confidence:</span>
          <span className={`rounded px-2 py-0.5 text-xs font-mono font-bold border ${getConfidenceBadge(range.confidence)}`}>
            {range.confidence}
          </span>
        </div>
      </div>

      {/* Visual Range Bar */}
      <div className="mt-6 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-5">
        <div className="flex items-center justify-between text-xs font-mono text-[#92989e] mb-2">
          <span>CONSERVATIVE / LOW</span>
          <span className="font-semibold text-[#b8f34a]">CENTRAL ESTIMATE</span>
          <span>STRESSED / HIGH</span>
        </div>

        {/* Range Track */}
        <div className="relative my-4 h-3 rounded-full bg-[#171a1d] overflow-hidden">
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-[#7c8cff]/40 via-[#b8f34a] to-[#ff5c5c]/40 rounded-full"
            style={{ left: '20%', right: '20%' }}
          />
          {/* Central Point */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-[#f5f5f2] rounded-full shadow-md transform -translate-x-1/2"
            style={{ left: '50%' }}
          />
        </div>

        {/* Numeric Indicators */}
        <div className="flex items-center justify-between text-sm font-mono font-bold text-[#f5f5f2]">
          <span className="text-[#7c8cff]">${range.lowUsdM.toFixed(1)}M</span>
          <span className="text-xl text-[#b8f34a]">${modeledImpactUsdM.toFixed(1)}M</span>
          <span className="text-[#ff5c5c]">${range.highUsdM.toFixed(1)}M</span>
        </div>
      </div>

      {/* Why is confidence medium? Accordion */}
      <div className="mt-4 rounded-lg border border-[#24282c] bg-[#171a1d] overflow-hidden">
        <button
          onClick={() => setShowReason(!showReason)}
          className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-[#f5f5f2] hover:bg-[#1e2225] transition"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#7c8cff]" />
            Why is impact confidence rated {range.confidence}?
          </span>
          {showReason ? <ChevronUp className="h-4 w-4 text-[#92989e]" /> : <ChevronDown className="h-4 w-4 text-[#92989e]" />}
        </button>

        {showReason && (
          <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#92989e] leading-relaxed border-t border-[#24282c] bg-[#0a0a0b]/40">
            <p>{range.reason}</p>
            <p className="mt-2 text-[11px] text-[#656b70]">
              To elevate confidence to HIGH, secondary historical regression models must confirm corporate deposit beta pass-through within a ±3% tolerance band.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
