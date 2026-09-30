import { useState } from 'react';
import { SlidersHorizontal, Info } from 'lucide-react';
import type { SensitivityMatrixData, SensitivityAssumption } from '@/types/quantitative-intelligence';

interface Props {
  matrix: SensitivityMatrixData;
  assumptions: SensitivityAssumption[];
}

export function SensitivityMatrixView({ matrix, assumptions }: Props) {
  const [hoveredCell, setHoveredCell] = useState<{
    prob: number;
    mag: number;
    impact: number;
  } | null>(null);

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="border-b border-[#24282c] pb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
          HYPOTHESIS TESTING
        </span>
        <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
          Sensitivity Analysis & Stress Matrix
        </h3>
        <p className="mt-1 text-xs text-[#92989e]">
          Examine which modeled assumptions introduce the highest volatility to the financial impact estimate.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sensitivity Ranking */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#92989e] mb-3">
            Assumption Elasticity Ranking
          </div>

          <div className="space-y-3">
            {assumptions.map((item) => {
              const getLevelColor = (level: string) => {
                if (level === 'HIGH') return 'text-[#ff5c5c] bg-[#ff5c5c]/10';
                if (level === 'MEDIUM') return 'text-[#b8f34a] bg-[#b8f34a]/10';
                return 'text-[#92989e] bg-[#92989e]/10';
              };

              return (
                <div key={item.name} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#f5f5f2]">{item.name}</span>
                    <span className={`rounded px-1.5 py-0.2 text-[10px] font-mono font-bold ${getLevelColor(item.level)}`}>
                      {item.level} SENSITIVITY
                    </span>
                  </div>

                  {/* Discrete bar ticks */}
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-sm ${
                          i < item.bars
                            ? item.level === 'HIGH'
                              ? 'bg-[#ff5c5c]'
                              : item.level === 'MEDIUM'
                              ? 'bg-[#b8f34a]'
                              : 'bg-[#92989e]'
                            : 'bg-[#0a0a0b]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-2 text-[11px] text-[#92989e]">
                    {item.rationale}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive 3x3 Matrix */}
        <div>
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#92989e] mb-3">
            Probability × Magnitude Matrix ($M Modeled Impact)
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-4">
            <div className="text-center text-[10px] font-mono text-[#92989e] mb-2">
              MARKET PROBABILITY →
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-[10px] font-mono text-[#656b70] border-b border-[#24282c]">
                      MAGNITUDE
                    </th>
                    {matrix.probabilities.map((p) => (
                      <th key={p} className="p-2 text-xs font-mono font-semibold text-[#f5f5f2] border-b border-[#24282c]">
                        {p}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.magnitudes.map((mag, rIdx) => (
                    <tr key={mag}>
                      <td className="p-2 text-xs font-mono text-[#92989e] border-r border-[#24282c] font-medium text-left">
                        {mag}%
                      </td>
                      {matrix.probabilities.map((prob, cIdx) => {
                        const cell = matrix.cells[rIdx]?.[cIdx];
                        const val = cell?.modeledImpactUsdM ?? 0;
                        const isHovered =
                          hoveredCell?.prob === prob && hoveredCell?.mag === mag;

                        return (
                          <td
                            key={prob}
                            onMouseEnter={() =>
                              setHoveredCell({ prob, mag, impact: val })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`p-3 text-xs font-mono font-bold cursor-pointer transition border border-[#1e2225] ${
                              isHovered
                                ? 'bg-[#b8f34a]/20 text-[#b8f34a] border-[#b8f34a]'
                                : val > 20
                                ? 'text-[#ff5c5c] hover:bg-[#ff5c5c]/10'
                                : val > 12
                                ? 'text-[#b8f34a] hover:bg-[#b8f34a]/10'
                                : 'text-[#7c8cff] hover:bg-[#7c8cff]/10'
                            }`}
                          >
                            ${val.toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hover details */}
            <div className="mt-4 rounded bg-[#171a1d] p-3 text-xs border border-[#24282c] flex items-center justify-between">
              {hoveredCell ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#92989e]">Prob: {hoveredCell.prob}%</span>
                    <span className="font-mono text-[#92989e]">Magnitude: {hoveredCell.mag}%</span>
                  </div>
                  <div className="font-mono font-bold text-[#b8f34a]">
                    Impact: ${hoveredCell.impact.toFixed(1)}M
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-[#656b70] flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-[#92989e]" />
                  Hover over any cell in the 3×3 matrix to inspect the cross-variable outcome.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
