import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  ExternalLink,
  Layers,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { EventBusinessUnitMatrixCell, ImpactDirection } from '@/types/risk-intelligence';

interface Props {
  matrixData: EventBusinessUnitMatrixCell[];
  onSelectCell?: (eventId: string, businessUnitId: string) => void;
}

export function EventBusinessUnitMatrix({ matrixData, onSelectCell }: Props) {
  const [, setLocation] = useLocation();
  const [hoveredCell, setHoveredCell] = useState<{ eventId: string; unitId: string } | null>(null);

  const units = [
    { id: 'commercial-banking', label: 'Commercial' },
    { id: 'markets', label: 'Markets' },
    { id: 'consumer-banking', label: 'Consumer (CCB)' },
    { id: 'asset-management', label: 'Asset & Wealth (AWM)' },
    { id: 'payments', label: 'Payments' },
  ];

  const getDirectionClass = (direction: ImpactDirection) => {
    switch (direction) {
      case 'NEGATIVE':
        return 'text-[#ff6b6b] bg-[#221515] border-[#442323]';
      case 'POSITIVE':
        return 'text-[#b8f34a] bg-[#162115] border-[#31482f]';
      case 'MIXED':
        return 'text-[#f5c76c] bg-[#1e1a12] border-[#483d26]';
      default:
        return 'text-[#8e989d] bg-[#141719] border-[#252c31]';
    }
  };

  const getDirectionIndicator = (direction: ImpactDirection) => {
    switch (direction) {
      case 'NEGATIVE':
        return '-';
      case 'POSITIVE':
        return '+';
      case 'MIXED':
        return '±';
      default:
        return '~';
    }
  };

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              EXPOSURE CROSS-TABULATION
            </span>
          </div>
          <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
            Event → Business Unit Exposure Matrix
          </h2>
          <p className="mt-1 text-[12px] text-[#8e989d]">
            Asymmetric business unit exposure distributions across major external risk catalysts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-[#848f94]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff6b6b]" /> Negative
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#b8f34a]" /> Positive
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f5c76c]" /> Mixed
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
              <th className="py-2.5 pl-3">CANONICAL EVENT</th>
              <th className="py-2.5">RISK TYPE</th>
              {units.map((u) => (
                <th key={u.id} className="py-2.5 text-right pr-4">
                  {u.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b2023]">
            {matrixData.map((row) => (
              <tr key={row.eventId} className="hover:bg-[#14181a] transition-colors">
                <td className="max-w-[220px] py-3.5 pl-3">
                  <div
                    onClick={() => setLocation(`/events/${row.eventId}`)}
                    className="cursor-pointer font-medium text-[#edf0eb] hover:text-[#b8f34a] transition-colors truncate"
                  >
                    {row.eventTitle}
                  </div>
                  <div className="mono text-[9px] text-[#6b767b]">{row.eventId}</div>
                </td>
                <td className="py-3.5 text-[#9ea7ad] whitespace-nowrap">
                  {row.riskName}
                </td>
                {units.map((u) => {
                  const cell = row.units[u.id];
                  if (!cell) {
                    return (
                      <td key={u.id} className="py-3.5 pr-4 text-right mono text-[#4e585e]">
                        —
                      </td>
                    );
                  }
                  return (
                    <td key={u.id} className="py-3.5 pr-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectCell?.(row.eventId, u.id)}
                        onMouseEnter={() => setHoveredCell({ eventId: row.eventId, unitId: u.id })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`inline-flex flex-col items-end rounded border px-2.5 py-1 text-right transition-all hover:scale-105 ${getDirectionClass(
                          cell.direction
                        )}`}
                      >
                        <span className="mono text-[12px] font-semibold">
                          {getDirectionIndicator(cell.direction)}${cell.amountUsdM.toFixed(1)}M
                        </span>
                        <span className="mono text-[8px] opacity-75">
                          {cell.relationship} · {cell.confidencePct.toFixed(0)}%
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
