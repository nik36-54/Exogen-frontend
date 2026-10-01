import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { riskScoreBuckets } from '@/data/validation-intelligence-data';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function RiskScoreValidationPage() {
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

        <span className="text-[10px] font-mono text-[#6c7479]">MODEL v0.1 · 987 EVALUATIONS</span>
      </div>

      {/* Header (Section 31) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              RANK CORRELATION & MONOTONICITY · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              SYNTHETIC BENCHMARK
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Risk Score Validation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Do higher Exogen risk scores systematically correspond to higher observed real-world materiality and subsequent drawdown?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Monotonicity Guide</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards (Section 32 & 33) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Monotonicity Coefficient</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">0.82</span>
            <span className="text-[10px] font-mono text-[#6c7479]">/ 1.0</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Strict monotonic ordering</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">AUC-ROC Discrimination</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">0.724</span>
            <span className="text-[10px] font-mono text-[#6c7479]">C-Index</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Separation capability</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Rank Correlation (ρ)</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">0.68</span>
            <span className="text-[10px] font-mono text-[#6c7479]">Spearman</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Observed financial volatility</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Precision @ High Risk (&gt;70)</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">62.4%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">hit rate</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Top risk bracket</div>
        </div>
      </div>

      {/* Monotonicity Bar Chart & Table (Section 31 & 32) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f2]">
              Risk Score Buckets vs. Observed Material Outcome Rate
            </h2>
            <p className="text-xs text-[#8d969b]">
              Verifying that as Exogen’s risk score bracket escalates, empirical outcome rates climb monotonically.
            </p>
          </div>
          <span className="text-xs font-mono text-[#b8f34a]">
            Monotonicity Test: PASS (0.82)
          </span>
        </div>

        {/* Visual Bar Display */}
        <div className="space-y-4 pt-2">
          {riskScoreBuckets.map((b) => (
            <div key={b.bucket} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#f5f5f2] w-16">{b.bucket}</span>
                  <span className="text-[#8d969b]">({b.label} Risk · {b.eventCount} events)</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#8d969b]">Avg Impact: ${b.avgSubsequentImpactM.toFixed(1)}M</span>
                  <span className="font-bold text-[#b8f34a] w-12 text-right">{b.outcomeRatePct.toFixed(0)}%</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-3 w-full bg-[#161a1d] rounded-full overflow-hidden border border-[#24282c]">
                <div
                  className="h-full bg-gradient-to-r from-[#1e2a1d] to-[#b8f34a] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(b.outcomeRatePct, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#0d0f11] p-3 text-xs text-[#8d969b] leading-relaxed">
          <strong className="text-[#f5f5f2]">Institutional Finding:</strong> Events scored between 81–100 triggered material balance-sheet disruptions <strong>51%</strong> of the time, compared to only <strong>4%</strong> for events scored 0–20. This 12.8x lift confirms the directional validity of the composite risk scoring model v0.1.
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
