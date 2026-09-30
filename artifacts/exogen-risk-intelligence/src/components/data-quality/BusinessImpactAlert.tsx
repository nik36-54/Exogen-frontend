import { AlertTriangle, ArrowRight, ShieldAlert, TrendingDown } from 'lucide-react';

interface Props {
  contractTitle?: string;
  affectedCanonicalCount: number;
  affectedSignalsCount: number;
  affectedExposureUsdM: number;
  onViewAffectedEvents: () => void;
  onViewSignals?: () => void;
}

export function BusinessImpactAlert({
  contractTitle = 'Selected contract record',
  affectedCanonicalCount,
  affectedSignalsCount,
  affectedExposureUsdM,
  onViewAffectedEvents,
  onViewSignals,
}: Props) {
  return (
    <div className="rounded-[8px] border border-[#443826] bg-[#16130d] p-4 text-[11px]">
      <div className="flex items-center gap-2 text-[#f5c76c]">
        <ShieldAlert size={15} />
        <span className="font-semibold tracking-[.08em] text-[10px] uppercase">
          Downstream Business Impact Propagation
        </span>
      </div>

      <p className="mt-2 text-[#cbbe9d] leading-relaxed">
        Data quality degradation is not solely an infrastructure issue. When external contracts become stale, invalid, or ambiguous, error propagates directly into corporate risk models:
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <button
          type="button"
          onClick={onViewAffectedEvents}
          className="group rounded border border-[#3b321c] bg-[#1c180e] p-2.5 text-left transition-colors hover:border-[#67562f]"
        >
          <span className="block text-[8px] font-semibold tracking-[.1em] text-[#938563]">
            AFFECTED CANONICAL EVENTS
          </span>
          <div className="mono mt-1 flex items-center justify-between text-[16px] font-semibold text-[#f5c76c]">
            <span>{affectedCanonicalCount}</span>
            <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </button>

        <button
          type="button"
          onClick={onViewSignals}
          className="group rounded border border-[#3b321c] bg-[#1c180e] p-2.5 text-left transition-colors hover:border-[#67562f]"
        >
          <span className="block text-[8px] font-semibold tracking-[.1em] text-[#938563]">
            AFFECTED RISK SIGNALS
          </span>
          <div className="mono mt-1 flex items-center justify-between text-[16px] font-semibold text-[#f5c76c]">
            <span>{affectedSignalsCount}</span>
            <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </button>

        <div className="rounded border border-[#3b321c] bg-[#1c180e] p-2.5">
          <span className="block text-[8px] font-semibold tracking-[.1em] text-[#938563]">
            AFFECTED JPMORGAN EXPOSURE
          </span>
          <div className="mono mt-1 text-[16px] font-semibold text-[#f5c76c]">
            ${affectedExposureUsdM.toFixed(1)}M
          </div>
        </div>
      </div>
    </div>
  );
}
