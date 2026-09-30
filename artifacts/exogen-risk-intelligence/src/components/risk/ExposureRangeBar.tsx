import { SlidersHorizontal } from 'lucide-react';

interface Props {
  lowUsdM: number;
  baseUsdM: number;
  highUsdM: number;
  title?: string;
  maxAxisUsdM?: number;
}

export function ExposureRangeBar({
  lowUsdM,
  baseUsdM,
  highUsdM,
  title = 'Exposure Range Spread',
  maxAxisUsdM = Math.max(50, highUsdM * 1.3),
}: Props) {
  const lowPct = Math.max(4, Math.min(95, (lowUsdM / maxAxisUsdM) * 100));
  const basePct = Math.max(4, Math.min(95, (baseUsdM / maxAxisUsdM) * 100));
  const highPct = Math.max(4, Math.min(95, (highUsdM / maxAxisUsdM) * 100));

  return (
    <div className="rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
      <div className="flex items-center justify-between border-b border-[#1d2225] pb-2 text-[9px]">
        <span className="font-semibold tracking-[.1em] text-[#717c82] uppercase">{title}</span>
        <span className="mono text-[#5c676d]">Illustrative Model Range</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded border border-[#1f2427] bg-[#121517] p-2">
          <span className="block text-[8px] text-[#6e797e]">LOW RANGE</span>
          <span className="mono text-[14px] font-semibold text-[#8ca3b8]">${lowUsdM.toFixed(1)}M</span>
        </div>
        <div className="rounded border border-[#2b3a24] bg-[#151f13] p-2">
          <span className="block text-[8px] text-[#86ab6f]">BASE MODEL</span>
          <span className="mono text-[16px] font-semibold text-[#b8f34a]">${baseUsdM.toFixed(1)}M</span>
        </div>
        <div className="rounded border border-[#1f2427] bg-[#121517] p-2">
          <span className="block text-[8px] text-[#6e797e]">HIGH STRESS</span>
          <span className="mono text-[14px] font-semibold text-[#f5c76c]">${highUsdM.toFixed(1)}M</span>
        </div>
      </div>

      {/* Range bar line */}
      <div className="relative mt-5 pt-3 pb-2">
        <div className="h-1.5 w-full rounded-full bg-[#1c2225]">
          {/* Active range block */}
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-[#708b9b] via-[#b8f34a] to-[#f5c76c]"
            style={{
              marginLeft: `${lowPct}%`,
              width: `${Math.max(10, highPct - lowPct)}%`,
            }}
          />
        </div>

        {/* Base indicator needle */}
        <div
          className="absolute -top-1 flex flex-col items-center"
          style={{ left: `${basePct}%`, transform: 'translateX(-50%)' }}
        >
          <div className="h-4 w-1 rounded bg-[#b8f34a]" />
          <span className="mono text-[8px] text-[#b8f34a]">BASE</span>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-[9px] text-[#5e696e]">
        <span>$0M</span>
        <span>Low: ${lowUsdM.toFixed(1)}M</span>
        <span>Base: ${baseUsdM.toFixed(1)}M</span>
        <span>High: ${highUsdM.toFixed(1)}M</span>
        <span>${maxAxisUsdM.toFixed(0)}M max</span>
      </div>
    </div>
  );
}
