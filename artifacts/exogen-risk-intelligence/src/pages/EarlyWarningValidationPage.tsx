import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import {
  warningConfusionMatrix,
  warningThresholdTradeoffs,
} from '@/data/validation-intelligence-data';
import { ConfusionMatrixWidget } from '@/components/validation/ConfusionMatrixWidget';
import { ThresholdSliderAnalysis } from '@/components/validation/ThresholdSliderAnalysis';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function EarlyWarningValidationPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLocation('/backtesting')}
          className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Backtesting</span>
        </button>

        <span className="text-[10px] font-mono text-[#6c7479]">SENTINEL BENCHMARK · RULE v0.2</span>
      </div>

      {/* Header (Section 27) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              EARLY WARNING SENSITIVITY & LEAD TIME · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              1,248 EVALUATED WARNINGS
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Early Warning Performance
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Empirically evaluate whether Exogen warnings arrived before material external changes occurred, measuring advance lead time, detection recall, and false alarm rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Lead Time Methodology</span>
          </button>
        </div>
      </div>

      {/* Top Banner Notice */}
      <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-xs text-[#8d969b] flex items-center justify-between">
        <span>
          <strong>Lead Time Definition:</strong> Time elapsed between automated sentinel firing and official resolution settlement timestamp (Lead Time = T_outcome − T_warning).
        </span>
        <span className="text-[10px] font-mono text-[#6c7479]">
          Evaluation Horizon: 7–30 Days
        </span>
      </div>

      {/* 2x2 Contingency Matrix (Section 29) */}
      <ConfusionMatrixWidget data={warningConfusionMatrix} />

      {/* Threshold Analysis Simulator (Section 30) */}
      <ThresholdSliderAnalysis tradeoffs={warningThresholdTradeoffs} />

      {/* Error Analysis & Diagnostic Factors (Section 82 & 83) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* False Positive Diagnostic */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#e5c07b]">
            <AlertTriangle size={15} />
            <span>Diagnostic Audit: Why Was This Warning Not Validated? (False Positives)</span>
          </div>
          <p className="text-xs text-[#92989e] leading-relaxed">
            In 64 evaluated cases, Exogen’s risk score exceeded 70, but no qualifying material disruption occurred within the evaluation window. Potential diagnostic drivers:
          </p>
          <ul className="space-y-1.5 text-xs text-[#c8cece]">
            <li className="flex items-start gap-2">
              <span className="text-[#e5c07b] font-mono">•</span>
              <span><strong>Pre-emptive Mitigation:</strong> Corporate policy action neutralized the transmission path before losses occurred.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#e5c07b] font-mono">•</span>
              <span><strong>Prediction Market Reversal:</strong> Sudden counter-evidence in underlying contracts retracted probability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#e5c07b] font-mono">•</span>
              <span><strong>Narrow Horizon Window:</strong> Disruption occurred beyond the 30-day evaluation cut-off.</span>
            </li>
          </ul>
        </div>

        {/* False Negative Diagnostic */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ff7b72]">
            <ShieldAlert size={15} />
            <span>Diagnostic Audit: Why Did Exogen Miss This? (False Negatives)</span>
          </div>
          <p className="text-xs text-[#92989e] leading-relaxed">
            In 41 cases, a material risk outcome occurred without an advance sentinel alert. Contributing technical factors identified during post-mortem audits:
          </p>
          <ul className="space-y-1.5 text-xs text-[#c8cece]">
            <li className="flex items-start gap-2">
              <span className="text-[#ff7b72] font-mono">•</span>
              <span><strong>Rapid Liquidity Shock:</strong> Event unfolded in under 2 hours, faster than daily polling intervals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff7b72] font-mono">•</span>
              <span><strong>Novel Transmission Edge:</strong> Downstream business unit relationship was not yet mapped in taxonomy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff7b72] font-mono">•</span>
              <span><strong>Below Risk Threshold:</strong> Risk score peaked at 67 (just under the 70 warning threshold).</span>
            </li>
          </ul>
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
