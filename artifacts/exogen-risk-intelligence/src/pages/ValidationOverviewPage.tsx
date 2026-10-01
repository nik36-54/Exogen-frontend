import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Database,
  Eye,
  FileCheck2,
  GitBranch,
  HelpCircle,
  History,
  Layers,
  Network,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  validationSummaryMetrics,
  validationHealthIndicators,
  calibrationBucketsList,
} from '@/data/validation-intelligence-data';
import { CalibrationCurveChart } from '@/components/validation/CalibrationCurveChart';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function ValidationOverviewPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const m = validationSummaryMetrics;

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header (Section 4 & 5) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              EMPIRICAL VALIDATION & CALIBRATION · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              SYNTHETIC BENCHMARK v1.4
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Model Validation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Measure how Exogen's predictions, risk signals, and impact models perform against historical outcomes. Every intelligence output is empirically testable.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            onClick={() => setLocation('/historical-replay')}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#c8f56a] transition"
          >
            <History size={14} />
            <span>Historical Replay →</span>
          </button>
        </div>
      </div>

      {/* Top Banner Notice */}
      <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-xs text-[#8d969b] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#b8f34a] animate-pulse" />
          <span>
            <strong>Illustrative validation results.</strong> Synthetic benchmark dataset (1,248 evaluated predictions across 2025). Strict absence of look-ahead bias enforced.
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#6c7479]">
          Horizon: 30 days · Walk-Forward Window
        </div>
      </div>

      {/* Top-Level Metrics Grid (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Evaluated Events</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{m.evaluatedEvents.toLocaleString()}</span>
            <span className="text-[10px] font-mono text-[#6c7479]">events</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">365-day walk forward</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Probability Brier Score</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">{m.probabilityBrierScore.toFixed(3)}</span>
            <span className="text-[10px] font-mono text-[#6c7479]">MSE</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">95% CI: 0.129–0.156</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Calibration Error (ECE)</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{(m.calibrationError * 100).toFixed(1)}%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">deciles</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Log Loss: {m.logLoss.toFixed(3)}</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Warning Lead Time</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">{m.warningLeadTimeHours.toFixed(1)}h</span>
            <span className="text-[10px] font-mono text-[#6c7479]">avg</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Median: {m.warningMedianLeadTimeHours.toFixed(1)}h</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Matching Precision</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{m.matchingPrecisionPct.toFixed(1)}%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">F1: {m.matchingF1Score.toFixed(3)}</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Recall: {m.matchingRecallPct.toFixed(1)}%</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Matching Recall</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{m.matchingRecallPct.toFixed(1)}%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">audit</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">4,812 contract pairs</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Risk Score Correlation</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">{m.riskScoreCorrelation.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-[#6c7479]">Rank ρ</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Monotonicity: {m.riskScoreMonotonicity.toFixed(2)}</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Impact Coverage</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{m.impactCoveragePct.toFixed(0)}%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">bounds</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">214 proxy balance sheets</div>
        </div>
      </div>

      {/* Main Grid: Health Indicators + Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Validation Health & Diagnostic Matrix (Section 6 & 67) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f2]">
                  Validation Health & Evidence Matrix
                </h3>
                <p className="text-xs text-[#8d969b]">
                  Factual diagnostic status across Exogen’s analytical layers (not a simplistic score).
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#6c7479]">DIAGNOSTIC STATUS</span>
            </div>

            <div className="space-y-3">
              {validationHealthIndicators.map((item) => (
                <div
                  key={item.capability}
                  className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#384046] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#f5f5f2]">{item.capability}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          item.status === 'Strong'
                            ? 'bg-[#182619] text-[#7ee787] border-[#2e5030]'
                            : item.status === 'Good'
                            ? 'bg-[#18231a] text-[#b8f34a] border-[#2f4228]'
                            : item.status === 'Developing'
                            ? 'bg-[#292218] text-[#e5c07b] border-[#4a3c26]'
                            : 'bg-[#231b1b] text-[#ff7b72] border-[#4a2b2b]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8d969b] leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[#f5f5f2]">{item.metric}</div>
                    <div className="text-[10px] font-mono text-[#6c7479]">
                      n = {item.sampleSize.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reliability Chart */}
          <CalibrationCurveChart
            buckets={calibrationBucketsList}
            onSelectBucket={() => setLocation('/calibration')}
          />
        </div>

        {/* Right Col: Navigation Pathways & Scientific Loop */}
        <div className="space-y-6">
          {/* Quick Sub-Navigation Panel */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-2">
              Validation Workspaces
            </h3>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setLocation('/backtesting')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#24282c] bg-[#161a1d] hover:bg-[#1f2429] hover:border-[#b8f34a]/40 text-left transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] transition-colors">
                    Backtesting Engine
                  </div>
                  <div className="text-[11px] text-[#8d969b]">
                    Configurable walk-forward backtests & run registry
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6c7479] group-hover:text-[#b8f34a] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setLocation('/calibration')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#24282c] bg-[#161a1d] hover:bg-[#1f2429] hover:border-[#b8f34a]/40 text-left transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] transition-colors">
                    Probability Calibration
                  </div>
                  <div className="text-[11px] text-[#8d969b]">
                    Decile reliability curves & overconfidence diagnostics
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6c7479] group-hover:text-[#b8f34a] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setLocation('/historical-replay')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#24282c] bg-[#161a1d] hover:bg-[#1f2429] hover:border-[#b8f34a]/40 text-left transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] transition-colors">
                    Historical Replay
                  </div>
                  <div className="text-[11px] text-[#8d969b]">
                    Time-isolated replay of decisions, graph & lead time
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6c7479] group-hover:text-[#b8f34a] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setLocation('/model-performance')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-[#24282c] bg-[#161a1d] hover:bg-[#1f2429] hover:border-[#b8f34a]/40 text-left transition group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] transition-colors">
                    Model Performance & Drift
                  </div>
                  <div className="text-[11px] text-[#8d969b]">
                    Multi-version comparisons and quarterly drift audits
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#6c7479] group-hover:text-[#b8f34a] transition-colors" />
              </button>
            </div>
          </div>

          {/* Scientific Validation Loop (Section 70 & 92) */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-2">
              Continuous Intelligence Loop
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 p-2 rounded bg-[#161a1d] border border-[#24282c]">
                <span className="text-[#b8f34a]">01. SENSE</span>
                <span className="text-[#8d969b] text-[11px]">External prediction contracts</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-[#161a1d] border border-[#24282c]">
                <span className="text-[#b8f34a]">02. WARN</span>
                <span className="text-[#8d969b] text-[11px]">Automated sentinel triggers</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-[#161a1d] border border-[#24282c]">
                <span className="text-[#b8f34a]">03. OBSERVE</span>
                <span className="text-[#8d969b] text-[11px]">Official market outcome resolution</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-[#161a1d] border border-[#24282c]">
                <span className="text-[#b8f34a]">04. VALIDATE</span>
                <span className="text-[#8d969b] text-[11px]">Brier, ECE, Lead Time, Coverage</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-[#1e2a1d] border border-[#b8f34a]/30 text-[#b8f34a]">
                <span>05. CALIBRATE</span>
                <span className="text-[#d8f5a2] text-[11px]">Update Model & Re-test</span>
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
