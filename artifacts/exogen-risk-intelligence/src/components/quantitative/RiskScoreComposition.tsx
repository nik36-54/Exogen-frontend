import { Info, HelpCircle } from 'lucide-react';
import type { RiskScoreDriver } from '@/types/quantitative-intelligence';

interface Props {
  score: number;
  category: string;
  drivers: RiskScoreDriver[];
  onOpenMethodology?: () => void;
}

export function RiskScoreComposition({ score, category, drivers, onOpenMethodology }: Props) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'CRITICAL':
        return 'text-[#ff5c5c] bg-[#ff5c5c]/10 border-[#ff5c5c]/30';
      case 'HIGH':
        return 'text-[#b8f34a] bg-[#b8f34a]/10 border-[#b8f34a]/30';
      case 'MEDIUM':
        return 'text-[#7c8cff] bg-[#7c8cff]/10 border-[#7c8cff]/30';
      default:
        return 'text-[#92989e] bg-[#92989e]/10 border-[#92989e]/30';
    }
  };

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              QUANTITATIVE FACTOR ATTRIBUTION
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#656b70] border border-[#24282c]">
              ILLUSTRATIVE v0.1
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Risk Score Composition & Drivers
          </h3>
        </div>

        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1.5 text-xs text-[#b8f34a] hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            How is this score calculated?
          </button>
        )}
      </div>

      {/* Main Score Visual Callout */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-mono font-bold text-[#f5f5f2]">{score}</span>
          <span className="text-sm font-mono text-[#656b70]">/ 100</span>
          <span className={`rounded px-2 py-0.5 text-xs font-mono font-semibold border ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>

        <div className="md:col-span-2 text-xs text-[#92989e] leading-relaxed">
          The composite score is synthesized from 5 independently measurable dimensions. No single factor dominates: elevated probability (+18) and high modeled severity (+21) account for 50% of total score weight.
        </div>
      </div>

      {/* Contribution Stack */}
      <div className="mt-6 space-y-4">
        <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#92989e]">
          Score Component Breakdown
        </div>

        <div className="space-y-3">
          {drivers.map((driver) => {
            const isNegative = driver.contribution < 0;
            const widthPct = Math.min(100, Math.max(8, (Math.abs(driver.contribution) / 30) * 100));

            return (
              <div
                key={driver.factor}
                className="group rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 transition hover:border-[#3b4440]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#f5f5f2]">{driver.factor}</span>
                    <span className="text-[10px] font-mono text-[#656b70]">({driver.source})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#f5f5f2]">{driver.value}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                        isNegative ? 'bg-[#ff5c5c]/10 text-[#ff5c5c]' : 'bg-[#b8f34a]/10 text-[#b8f34a]'
                      }`}
                    >
                      {driver.contribution > 0 ? `+${driver.contribution}` : driver.contribution} pts
                    </span>
                  </div>
                </div>

                {/* Contribution bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-[#0a0a0b] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isNegative ? 'bg-[#ff5c5c]' : 'bg-[#b8f34a]'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-[#92989e]">
                  {driver.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
