import { ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { ConfusionMatrixData } from '@/types/validation-intelligence';

interface Props {
  data: ConfusionMatrixData;
}

export function ConfusionMatrixWidget({ data }: Props) {
  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2427] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              CONTINGENCY MATRIX · 30-DAY HORIZON
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              1,248 EVALUATED
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#f5f5f2]">
            Warning Contingency & Discrimination
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#8d969b]">Precision: <strong className="text-[#b8f34a]">{data.precisionPct.toFixed(1)}%</strong></span>
          <span className="text-[#8d969b]">Recall: <strong className="text-[#b8f34a]">{data.recallPct.toFixed(1)}%</strong></span>
          <span className="text-[#8d969b]">F1: <strong className="text-[#f5f5f2]">{data.f1Score.toFixed(3)}</strong></span>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* True Positive */}
        <div className="rounded-lg border border-[#1e2a1d] bg-[#121a13] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#b8f34a] font-semibold">TRUE POSITIVE (TP)</span>
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">{data.truePositive}</span>
          </div>
          <p className="text-xs text-[#a4b1a4] leading-relaxed">
            Warning triggered and defined material outcome subsequently occurred within evaluation window.
          </p>
          <div className="text-[10px] font-mono text-[#6c7479] pt-1 border-t border-[#1e2a1d]">
            Hit Rate: {((data.truePositive / (data.truePositive + data.falseNegative)) * 100).toFixed(1)}%
          </div>
        </div>

        {/* False Positive */}
        <div className="rounded-lg border border-[#2e241e] bg-[#1a1411] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#e5c07b] font-semibold">FALSE POSITIVE (FP)</span>
            <span className="text-2xl font-bold font-mono text-[#e5c07b]">{data.falsePositive}</span>
          </div>
          <p className="text-xs text-[#b8a79a] leading-relaxed">
            Warning sentinel fired, but no qualifying material disruption materialized (false alarm).
          </p>
          <div className="text-[10px] font-mono text-[#6c7479] pt-1 border-t border-[#2e241e]">
            False Alarm Rate: {((data.falsePositive / (data.falsePositive + data.trueNegative)) * 100).toFixed(1)}%
          </div>
        </div>

        {/* False Negative */}
        <div className="rounded-lg border border-[#301c1c] bg-[#1c1212] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#ff7b72] font-semibold">FALSE NEGATIVE (FN)</span>
            <span className="text-2xl font-bold font-mono text-[#ff7b72]">{data.falseNegative}</span>
          </div>
          <p className="text-xs text-[#bda7a7] leading-relaxed">
            Material outcome occurred without a qualifying pre-emptive sentinel warning (missed risk).
          </p>
          <div className="text-[10px] font-mono text-[#6c7479] pt-1 border-t border-[#301c1c]">
            Miss Rate: {((data.falseNegative / (data.truePositive + data.falseNegative)) * 100).toFixed(1)}%
          </div>
        </div>

        {/* True Negative */}
        <div className="rounded-lg border border-[#1f2427] bg-[#141719] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#8d969b] font-semibold">TRUE NEGATIVE (TN)</span>
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{data.trueNegative}</span>
          </div>
          <p className="text-xs text-[#7e878d] leading-relaxed">
            No warning was triggered, and no material disruption occurred during the evaluation horizon.
          </p>
          <div className="text-[10px] font-mono text-[#6c7479] pt-1 border-t border-[#1f2427]">
            Specificity: {((data.trueNegative / (data.falsePositive + data.trueNegative)) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Lead Time Distribution Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#24282c] bg-[#161a1d] p-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-[#b8f34a]" />
          <span className="font-semibold text-[#f5f5f2]">Warning Advance Notice (Lead Time):</span>
        </div>
        <div className="flex items-center gap-5 font-mono text-[11px]">
          <div>
            <span className="text-[#6c7479]">Median:</span>{' '}
            <strong className="text-[#f5f5f2]">{data.medianLeadTimeHours.toFixed(1)}h</strong>
          </div>
          <div>
            <span className="text-[#6c7479]">Mean:</span>{' '}
            <strong className="text-[#b8f34a]">{data.averageLeadTimeHours.toFixed(1)}h</strong>
          </div>
          <div>
            <span className="text-[#6c7479]">P90 (Top 10%):</span>{' '}
            <strong className="text-[#f5f5f2]">{data.p90LeadTimeHours.toFixed(1)}h</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
