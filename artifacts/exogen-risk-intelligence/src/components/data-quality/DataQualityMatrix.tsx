import { ArrowUpRight, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import type { DataQualityDimension } from '@/types/canonical-matching';

interface Props {
  dimensions: DataQualityDimension[];
  onSelectDimension: (dimensionId: string) => void;
  selectedDimensionId?: string;
}

export function DataQualityMatrix({
  dimensions,
  onSelectDimension,
  selectedDimensionId,
}: Props) {
  const getStatusBadge = (status: DataQualityDimension['status']) => {
    if (status === 'HEALTHY') {
      return (
        <span className="mono text-[10px] font-semibold text-[#b8f34a]">
          HEALTHY
        </span>
      );
    }
    if (status === 'MONITOR') {
      return (
        <span className="mono text-[10px] font-semibold text-[#f5c76c]">
          MONITOR
        </span>
      );
    }
    return (
      <span className="mono text-[10px] font-semibold text-[#ff6b6b]">
        {status}
      </span>
    );
  };

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            QUALITY AUDIT MATRIX
          </span>
          <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
            Multi-Dimensional Data Health Assessment
          </h2>
        </div>
        <span className="text-[11px] text-[#7c868c]">
          5 Core Dimensions · Real-time Continuous Verification
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#1f2428] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
              <th className="py-2.5 pl-3">QUALITY DIMENSION</th>
              <th className="py-2.5 text-right">SCORE</th>
              <th className="py-2.5 pl-6">STATUS</th>
              <th className="py-2.5 pl-6">FLAGGED ISSUES</th>
              <th className="py-2.5 pr-3 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b2023]">
            {dimensions.map((dim) => {
              const isSelected = selectedDimensionId === dim.id;
              return (
                <tr
                  key={dim.id}
                  onClick={() => onSelectDimension(dim.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#181e19]' : 'hover:bg-[#14181a]'
                  }`}
                >
                  <td className="py-3 pl-3 font-medium text-[#edf1eb]">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />
                      <span>{dim.dimension}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="mono text-[13px] font-semibold text-[#b8f34a]">
                      {dim.scorePct.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 pl-6">{getStatusBadge(dim.status)}</td>
                  <td className="py-3 pl-6 text-[#9ba5aa]">
                    {dim.issueDescription}
                  </td>
                  <td className="py-3 pr-3 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[10px] text-[#869298] hover:text-[#b8f34a]"
                    >
                      <span>Drill down</span>
                      <ChevronRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
