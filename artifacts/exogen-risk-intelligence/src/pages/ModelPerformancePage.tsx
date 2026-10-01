import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal,
  History,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  modelVersionsList,
  modelDriftQuarters,
} from '@/data/validation-intelligence-data';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function ModelPerformancePage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('MV-PROB-03');

  const selectedModel =
    modelVersionsList.find((m) => m.id === selectedModelId) ||
    modelVersionsList[0];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header (Section 43) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              GOVERNANCE & VERSION TRACKING · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              5 ACTIVE PRODUCTION MODELS
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Model Performance & Drift
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Unified scorecard across Exogen's analytical layers. Track performance improvements, changelogs, and quarterly calibration drift.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Governance Standards</span>
          </button>
        </div>
      </div>

      {/* Unified Scorecard Table (Section 43) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
          <div>
            <h2 className="text-base font-semibold text-[#f5f5f2]">
              Analytical Model Governance Scorecard
            </h2>
            <p className="text-xs text-[#8d969b]">
              Primary evaluation metrics across all active and historical model revisions.
            </p>
          </div>
          <span className="text-xs font-mono text-[#6c7479]">AUDITED BENCHMARKS</span>
        </div>

        <div className="overflow-x-auto soft-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1f2427] text-[10px] font-mono uppercase text-[#6c7479]">
                <th className="py-2.5 px-3">Model Layer</th>
                <th className="py-2.5 px-3">Active Version</th>
                <th className="py-2.5 px-3">Evaluated Dataset</th>
                <th className="py-2.5 px-3">Primary Metric</th>
                <th className="py-2.5 px-3">Performance</th>
                <th className="py-2.5 px-3">Delta vs Prev</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171a1d]">
              {modelVersionsList.map((m) => {
                const isSelected = m.id === selectedModelId;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-[#18231a]' : 'hover:bg-[#161a1d]'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#f5f5f2]">{m.name}</div>
                      <div className="text-[10px] font-mono text-[#6c7479]">Active since: {m.activeSince}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#b8f34a]">{m.version}</td>
                    <td className="py-3 px-3 font-mono text-[#8d969b]">{m.sampleSize.toLocaleString()} events</td>
                    <td className="py-3 px-3 font-mono text-[#f5f5f2]">{m.primaryMetric.name}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#b8f34a]">{m.primaryMetric.formatted}</td>
                    <td className="py-3 px-3 font-mono">
                      {m.primaryMetric.changeFromPrevious ? (
                        <span className="inline-flex items-center gap-1 text-[#7ee787]">
                          <TrendingUp size={12} />
                          <span>{m.primaryMetric.changeFromPrevious > 0 ? `+${m.primaryMetric.changeFromPrevious}` : m.primaryMetric.changeFromPrevious}</span>
                        </span>
                      ) : (
                        <span className="text-[#6c7479]">Baseline</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                          m.status === 'Strong'
                            ? 'bg-[#182619] text-[#7ee787] border-[#2e5030]'
                            : m.status === 'Good'
                            ? 'bg-[#18231a] text-[#b8f34a] border-[#2f4228]'
                            : 'bg-[#292218] text-[#e5c07b] border-[#4a3c26]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive (Section 44 & 45) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Version Details */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#f5f5f2]">
                Model Specification & Metadata
              </h3>
              <p className="text-xs text-[#8d969b]">
                {selectedModel.name}
              </p>
            </div>
            <span className="text-xs font-mono text-[#b8f34a] font-bold">
              {selectedModel.version}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#6c7479] block">DATASET BENCHMARK</span>
              <span className="text-[#f5f5f2]">{selectedModel.dataset}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#6c7479] block">EVALUATION PERIOD</span>
              <span className="text-[#f5f5f2]">{selectedModel.evaluationWindow}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-[#6c7479] block">CORE METHODOLOGY</span>
              <span className="text-[#a0a8af] font-sans text-xs">{selectedModel.methodology}</span>
            </div>
          </div>

          {/* Metric list */}
          <div className="space-y-2 pt-2 border-t border-[#1f2427]">
            <span className="text-[10px] font-mono text-[#6c7479] uppercase block">Evaluated Metrics</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {Object.entries(selectedModel.metrics).map(([k, v]) => (
                <div key={k} className="p-2 rounded bg-[#161a1d] border border-[#24282c] flex justify-between">
                  <span className="text-[#8d969b]">{k}:</span>
                  <span className="text-[#f5f5f2] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change History Log (Section 45) */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Model Revision History & Changelog
            </h3>
            <span className="text-xs font-mono text-[#6c7479]">AUDIT LOG</span>
          </div>

          <div className="space-y-3">
            {selectedModel.changeLog.map((change, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-[#b8f34a] font-mono mt-0.5">•</span>
                <span className="text-[#c8cece] leading-relaxed">{change}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg border border-[#24282c] bg-[#0d0f11] text-xs text-[#8d969b] leading-relaxed">
            <strong className="text-[#f5f5f2]">Governance Approval:</strong> All model version promotions undergo dual sign-off from Enterprise Risk Analytics and Supervisory Quantitative Auditing before deployment into continuous sensing feeds.
          </div>
        </div>
      </div>

      {/* Model Drift Over Time (Section 68 & 69) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Quarterly Calibration Drift Surveillance
            </h3>
            <p className="text-xs text-[#8d969b]">
              Surveillance tracking whether market regime changes or volume shocks induce calibration decay.
            </p>
          </div>
          <span className="text-xs font-mono text-[#7ee787] flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>NO DRIFT DETECTED (2025–2026)</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          {modelDriftQuarters.map((q) => (
            <div key={q.quarter} className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1">
              <span className="text-[#8d969b] text-[10px] block">{q.quarter}</span>
              <div className="text-base font-bold text-[#b8f34a]">
                {q.brierScore.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#6c7479]">ECE: {(q.calibrationError * 100).toFixed(1)}%</div>
              <div className="text-[9px] text-[#7ee787] pt-1">Stable · n={q.sampleSize}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Note (Section 71) */}
      <div className="rounded-xl border border-[#24282c] bg-[#0a0a0b] p-5 text-xs text-[#8d969b] leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#f5f5f2]">
          <BookOpen size={14} className="text-[#b8f34a]" />
          <span>Institutional Research Note</span>
        </div>
        <p>
          This evaluation measures historical model behavior under the selected outcome definitions and standardized walk-forward evaluation horizons. Performance should not be extrapolated outside the evaluated dataset, time window, or liquidity parameters. Model versions are updated deterministically based on empirical error analysis.
        </p>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
