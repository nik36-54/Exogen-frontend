import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  History,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  calibrationBucketsList,
  calibrationByCategories,
  modelVersionsList,
} from '@/data/validation-intelligence-data';
import { CalibrationCurveChart } from '@/components/validation/CalibrationCurveChart';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function ProbabilityCalibrationPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [activeVersion, setActiveVersion] = useState<'v0.3' | 'v0.2' | 'v0.1'>('v0.3');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const probVersions = modelVersionsList.filter((m) => m.modelType === 'probability');

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header (Section 12) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              RELIABILITY & STATISTICAL PROBABILITY · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              10 DECILE BUCKETS
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Probability Calibration
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Compare predicted probabilities with observed event frequencies. When Exogen estimated 70% probability, did events occur roughly 70% of the time?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Methodology Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setLocation('/backtesting')}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#c8f56a] transition"
          >
            <span>Backtesting Overview →</span>
          </button>
        </div>
      </div>

      {/* Calibration Summary Card (Section 14) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#b8f34a]" />
          <h2 className="text-sm font-semibold text-[#f5f5f2]">
            Calibration Interpretation Summary
          </h2>
        </div>
        <p className="text-xs text-[#c8cece] leading-relaxed">
          Exogen is relatively well calibrated between <strong>30% and 70%</strong> across evaluated canonical events. Predictions above <strong>80%</strong> show mild overconfidence in this illustrative dataset, reflecting market contract liquidity premiums in high-probability tails.
        </p>
        <div className="text-[11px] font-mono text-[#6c7479]">
          *Notice: This is an empirical evaluation of the synthetic demo dataset (1,248 evaluated events).
        </div>
      </div>

      {/* Model Version Comparison Selector (Section 15) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#f5f5f2]">Compare Model Version:</span>
          <div className="flex rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
            {probVersions.map((pv) => (
              <button
                key={pv.version}
                type="button"
                onClick={() => setActiveVersion(pv.version as any)}
                className={`px-3 py-1 rounded-md transition ${
                  activeVersion === pv.version
                    ? 'bg-[#172016] text-[#b8f34a] font-bold border border-[#b8f34a]/30'
                    : 'text-[#92989e] hover:text-[#f5f5f2]'
                }`}
              >
                {pv.version} ({pv.primaryMetric.value})
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[#8d969b]">
          Version progression: <span className="text-[#b8f34a]">v0.1 (0.182) → v0.2 (0.161) → v0.3 (0.142 Brier)</span>
        </div>
      </div>

      {/* Main Visual Grid: Calibration Chart + Decile Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calibration Curve Chart */}
        <div className="lg:col-span-6 space-y-6">
          <CalibrationCurveChart
            buckets={calibrationBucketsList}
            overallBrierScore={activeVersion === 'v0.3' ? 0.142 : activeVersion === 'v0.2' ? 0.161 : 0.182}
            overallCalibError={activeVersion === 'v0.3' ? 0.071 : activeVersion === 'v0.2' ? 0.089 : 0.103}
          />

          {/* Calibration by Event Category (Section 16) */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f2]">
                  Calibration by Event Class
                </h3>
                <p className="text-xs text-[#8d969b]">
                  Performance variation across distinct macroeconomic, regulatory, and commodity domains.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#6c7479]">DOMAIN BREAKDOWN</span>
            </div>

            <div className="space-y-2.5">
              {calibrationByCategories.map((c) => (
                <div
                  key={c.category}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#24282c] bg-[#161a1d] text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-[#f5f5f2]">{c.category}</div>
                    <div className="text-[10px] font-mono text-[#6c7479]">n = {c.sampleSize} events</div>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <div className="text-right">
                      <div className="text-[10px] text-[#6c7479]">Brier</div>
                      <div className="font-bold text-[#b8f34a]">{c.brier.toFixed(3)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#6c7479]">ECE Gap</div>
                      <div className="text-[#f5f5f2]">{(c.calibError * 100).toFixed(1)}%</div>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded border ${
                        c.status === 'Strong'
                          ? 'bg-[#182619] text-[#7ee787] border-[#2e5030]'
                          : c.status === 'Good'
                          ? 'bg-[#18231a] text-[#b8f34a] border-[#2f4228]'
                          : 'bg-[#292218] text-[#e5c07b] border-[#4a3c26]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Decile Probability Range Table (Section 17 & 18) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f2]">
                  Decile Calibration Table
                </h3>
                <p className="text-xs text-[#8d969b]">
                  Predictions vs empirical observed frequencies with sample size audit.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#6c7479]">10 BUCKETS</span>
            </div>

            <div className="overflow-x-auto soft-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#1f2427] text-[10px] font-mono uppercase text-[#6c7479]">
                    <th className="py-2.5 px-3">Probability Range</th>
                    <th className="py-2.5 px-3">Predictions (n)</th>
                    <th className="py-2.5 px-3">Avg Predicted</th>
                    <th className="py-2.5 px-3">Observed Rate</th>
                    <th className="py-2.5 px-3">Calibration Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171a1d] font-mono">
                  {calibrationBucketsList.map((b) => (
                    <tr key={b.probabilityRange} className="hover:bg-[#161a1d] transition">
                      <td className="py-2.5 px-3 font-semibold text-[#f5f5f2]">
                        {b.probabilityRange}
                      </td>
                      <td className="py-2.5 px-3 text-[#92989e]">
                        {b.sampleSize}
                        {b.sampleSize < 25 && (
                          <span className="ml-1.5 text-[9px] text-[#e5c07b] font-sans" title="Small sample size">
                            (low n)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[#92989e]">
                        {b.predictedProbability.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#b8f34a]">
                        {b.observedFrequency.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold ${
                            b.errorPp < -3
                              ? 'text-[#ff7b72]'
                              : b.errorPp > 3
                              ? 'text-[#7ee787]'
                              : 'text-[#92989e]'
                          }`}
                        >
                          {b.errorPp > 0 ? `+${b.errorPp.toFixed(1)}pp` : `${b.errorPp.toFixed(1)}pp`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sample Size Warning (Section 18) */}
            <div className="rounded-lg border border-[#3b321c] bg-[#1a160d] p-3 text-xs text-[#e5c07b] flex items-start gap-2.5">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Decile 90–100% Sample Notice (n = 17):</strong>
                <p className="mt-0.5 leading-relaxed text-[#cbb88a]">
                  Small sample size (17 events) — interpret tail frequency cautiously. In extreme certainty ranges, estimation error expands due to contract liquidity tapering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
