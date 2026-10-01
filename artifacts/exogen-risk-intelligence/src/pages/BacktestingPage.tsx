import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Play,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  FileCheck2,
  GitBranch,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import {
  backtestRunsList,
  validationSummaryMetrics,
} from '@/data/validation-intelligence-data';
import type { BacktestRun, BacktestType } from '@/types/validation-intelligence';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function BacktestingPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [runs, setRuns] = useState<BacktestRun[]>(backtestRunsList);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Builder state
  const [builderTarget, setBuilderTarget] = useState<BacktestType>('probability');
  const [builderHorizon, setBuilderHorizon] = useState('30 days');
  const [builderModelVersion, setBuilderModelVersion] = useState('Probability Model v0.3');
  const [builderDataset, setBuilderDataset] = useState('Historical Events v1.4');
  const [builderUniverse, setBuilderUniverse] = useState('All Canonical Events');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  const filteredRuns = runs.filter((r) => {
    const matchType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.modelVersion.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleRunBacktest = () => {
    setIsSimulatingRun(true);
    setTimeout(() => {
      const newRunId = `BT-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRun: BacktestRun = {
        id: newRunId,
        name: `${builderTarget.toUpperCase()} Evaluation (${builderHorizon})`,
        type: builderTarget,
        datasetVersion: builderDataset,
        modelVersion: builderModelVersion,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        evaluationHorizon: builderHorizon,
        sampleSize: builderTarget === 'matching' ? 4812 : 1248,
        status: 'completed',
        primaryMetricName:
          builderTarget === 'probability'
            ? 'Brier Score'
            : builderTarget === 'warning'
            ? 'Avg Lead Time'
            : builderTarget === 'matching'
            ? 'F1 Score'
            : builderTarget === 'impact'
            ? 'Range Coverage'
            : 'Monotonicity',
        primaryMetricValue:
          builderTarget === 'probability'
            ? 0.142
            : builderTarget === 'warning'
            ? 18.4
            : builderTarget === 'matching'
            ? 0.929
            : builderTarget === 'impact'
            ? 82.0
            : 0.82,
        primaryMetricFormatted:
          builderTarget === 'probability'
            ? '0.142 (Brier)'
            : builderTarget === 'warning'
            ? '18.4 hours'
            : builderTarget === 'matching'
            ? '92.9% (F1)'
            : builderTarget === 'impact'
            ? '82.0% within bounds'
            : '0.82 monotonicity',
        metrics: {
          sampleSize: 1248,
          evaluatedDays: 365,
        },
        description: `Custom configured walk-forward simulation for ${builderTarget} under ${builderHorizon} resolution horizon.`,
        createdAt: 'Just now',
        outcomeDefinition: 'Official market resolution settlement',
        evaluationWindowDays: 365,
      };

      setRuns([newRun, ...runs]);
      setIsSimulatingRun(false);
      setLocation(`/backtesting/${newRunId}`);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header (Section 7) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              WALK-FORWARD EVALUATION · REPRODUCIBLE BENCHMARK
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              6 RUNS ARCHIVED
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Backtesting
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Evaluate Exogen's historical predictions and risk signals against outcomes that became known later. Every test enforces zero look-ahead bias.
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
        </div>
      </div>

      {/* Backtest Builder (Section 8) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#b8f34a]" />
            <h2 className="text-base font-semibold text-[#f5f5f2]">
              Backtest Configuration Builder
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8d969b]">
            Evaluation Window: <strong className="text-[#f5f5f2]">Jan 2025 – Dec 2025</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8d969b]">Evaluation Target</label>
            <select
              value={builderTarget}
              onChange={(e) => setBuilderTarget(e.target.value as BacktestType)}
              className="w-full rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-xs text-[#f5f5f2] outline-none focus:border-[#b8f34a]"
            >
              <option value="probability">Probability Calibration (Brier, LogLoss)</option>
              <option value="warning">Early Warning Sentinels (Lead Time, FP Rate)</option>
              <option value="risk_score">Risk Score Monotonicity (Correlation)</option>
              <option value="matching">Canonical Matching (Precision, Recall, F1)</option>
              <option value="propagation">Causal Risk Propagation (Path Verification)</option>
              <option value="impact">Dollar Impact Range (Interval Coverage)</option>
            </select>
          </div>

          {/* Prediction Horizon */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8d969b]">Evaluation Horizon</label>
            <select
              value={builderHorizon}
              onChange={(e) => setBuilderHorizon(e.target.value)}
              className="w-full rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-xs text-[#f5f5f2] outline-none focus:border-[#b8f34a]"
            >
              <option value="24 hours">24 hours (Intraday Volatility)</option>
              <option value="7 days">7 days (Short-term Sentinel)</option>
              <option value="14 days">14 days (Propagation Lead Time)</option>
              <option value="30 days">30 days (Standard Consensus Horizon)</option>
              <option value="90 days">90 days (Macro & Earnings Cycle)</option>
            </select>
          </div>

          {/* Model Version */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8d969b]">Model Version</label>
            <select
              value={builderModelVersion}
              onChange={(e) => setBuilderModelVersion(e.target.value)}
              className="w-full rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-xs text-[#f5f5f2] outline-none focus:border-[#b8f34a]"
            >
              <option value="Probability Model v0.3">Probability Model v0.3 (Liquidity-Weighted)</option>
              <option value="Probability Model v0.2">Probability Model v0.2 (Cross-Venue Spread)</option>
              <option value="Probability Model v0.1">Probability Model v0.1 (Baseline Midpoint)</option>
              <option value="Sentinel Rules v0.2">Sentinel Rules v0.2 (Automated Thresholds)</option>
              <option value="Matching Model v0.3">Matching Model v0.3 (Fellegi-Sunter)</option>
              <option value="Dollar Impact Model v0.1">Dollar Impact Model v0.1 (EXP-00072)</option>
            </select>
          </div>

          {/* Dataset */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8d969b]">Historical Dataset</label>
            <select
              value={builderDataset}
              onChange={(e) => setBuilderDataset(e.target.value)}
              className="w-full rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-xs text-[#f5f5f2] outline-none focus:border-[#b8f34a]"
            >
              <option value="Historical Events v1.4">Historical Prediction Events v1.4 (Cleaned · 1,248)</option>
              <option value="Historical Events v1.2">Historical Prediction Events v1.2 (740 events)</option>
              <option value="Contract Matching Benchmark v2.1">Contract Matching Benchmark v2.1 (4,812 pairs)</option>
              <option value="Financial Outcome Benchmark v1.0">Financial Outcome Benchmark v1.0 (214 proxies)</option>
            </select>
          </div>

          {/* Universe */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#8d969b]">Event Universe</label>
            <select
              value={builderUniverse}
              onChange={(e) => setBuilderUniverse(e.target.value)}
              className="w-full rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-xs text-[#f5f5f2] outline-none focus:border-[#b8f34a]"
            >
              <option value="All Canonical Events">All Canonical Events (Multi-domain)</option>
              <option value="Macroeconomic & Central Banks">Macroeconomic & Central Banks</option>
              <option value="Regulatory & Compliance">Regulatory & Compliance</option>
              <option value="Commodities & Energy">Commodities & Energy</option>
              <option value="Geopolitics & Supply Chain">Geopolitics & Supply Chain</option>
            </select>
          </div>

          {/* Action Trigger */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleRunBacktest}
              disabled={isSimulatingRun}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#b8f34a] px-4 py-2.5 text-xs font-bold text-[#0a0a0b] hover:bg-[#c8f56a] transition disabled:opacity-50"
            >
              {isSimulatingRun ? (
                <>
                  <RotateCcw size={14} className="animate-spin" />
                  <span>Simulating Walk-Forward...</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-current" />
                  <span>Run Walk-Forward Backtest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conceptual Backtest Type Shortcuts (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setLocation('/calibration')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 01</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Probability
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">Brier 0.142</div>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/backtesting/warnings')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 02</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Early Warnings
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">18.4h Lead Time</div>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/backtesting/risk-scores')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 03</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Risk Scores
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">0.82 Monotonicity</div>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/backtesting/matching')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 04</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Matching
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">92.9% F1 Score</div>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/backtesting/propagation')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 05</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Propagation
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">71.0% Precision</div>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/backtesting/impact')}
          className="rounded-xl border border-[#24282c] bg-[#111416] p-3.5 text-left hover:border-[#b8f34a]/60 hover:bg-[#161a1d] transition group"
        >
          <div className="text-[10px] font-mono text-[#8d969b]">TYPE 06</div>
          <div className="text-xs font-semibold text-[#f5f5f2] mt-1 group-hover:text-[#b8f34a] transition-colors">
            Dollar Impact
          </div>
          <div className="text-[10px] font-mono text-[#b8f34a] mt-1.5">82.0% Coverage</div>
        </button>
      </div>

      {/* Backtest Run History (Section 61) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f2]">
              Backtest Run Registry
            </h2>
            <p className="text-xs text-[#8d969b]">
              Audited historical evaluation executions with reproducible configuration parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-[#24282c] bg-[#161a1d] px-2.5 py-1 text-xs">
              <Search size={13} className="text-[#6c7479] mr-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter runs..."
                className="bg-transparent text-xs text-[#f5f5f2] outline-none placeholder:text-[#6c7479]"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-[#24282c] bg-[#161a1d] px-2.5 py-1 text-xs text-[#f5f5f2] outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="probability">Probability</option>
              <option value="warning">Early Warning</option>
              <option value="risk_score">Risk Score</option>
              <option value="matching">Matching</option>
              <option value="propagation">Propagation</option>
              <option value="impact">Impact</option>
            </select>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto soft-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1f2427] text-[10px] font-mono uppercase text-[#6c7479]">
                <th className="py-2.5 px-3">Run ID</th>
                <th className="py-2.5 px-3">Evaluation Target & Name</th>
                <th className="py-2.5 px-3">Model Version</th>
                <th className="py-2.5 px-3">Horizon</th>
                <th className="py-2.5 px-3">Sample Size</th>
                <th className="py-2.5 px-3">Primary Metric</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171a1d] font-mono">
              {filteredRuns.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setLocation(`/backtesting/${r.id}`)}
                  className="hover:bg-[#161a1d] cursor-pointer transition"
                >
                  <td className="py-3 px-3 font-semibold text-[#b8f34a]">{r.id}</td>
                  <td className="py-3 px-3 font-sans font-medium text-[#f5f5f2] max-w-xs truncate">
                    {r.name}
                  </td>
                  <td className="py-3 px-3 text-[#92989e]">{r.modelVersion}</td>
                  <td className="py-3 px-3 text-[#f5f5f2]">{r.evaluationHorizon}</td>
                  <td className="py-3 px-3 text-[#92989e]">{r.sampleSize.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-[#b8f34a]">
                    {r.primaryMetricFormatted}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded bg-[#162215] px-2 py-0.5 text-[9px] text-[#7ee787] border border-[#2e5030]">
                      <CheckCircle2 size={10} />
                      <span>{r.status.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/backtesting/${r.id}`);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#92989e] hover:text-[#b8f34a] transition"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
