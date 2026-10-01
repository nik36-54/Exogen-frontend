import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck2,
  Filter,
  History,
  Info,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  backtestRunsList,
  historicalEventsBacktestTable,
  calibrationBucketsList,
} from '@/data/validation-intelligence-data';
import { CalibrationCurveChart } from '@/components/validation/CalibrationCurveChart';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

interface Props {
  runId: string;
}

export default function BacktestDetailPage({ runId }: Props) {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const run =
    backtestRunsList.find((r) => r.id === runId) ||
    backtestRunsList[0];

  const handleCopyConfig = () => {
    const configString = JSON.stringify(
      {
        backtestId: run.id,
        modelVersion: run.modelVersion,
        datasetVersion: run.datasetVersion,
        horizon: run.evaluationHorizon,
        timeWindow: `${run.startDate} to ${run.endDate}`,
        outcomeDefinition: run.outcomeDefinition,
        sampleSize: run.sampleSize,
        methodology: 'Exogen Walk-Forward Strict No Look-Ahead v0.1',
      },
      null,
      2
    );
    navigator.clipboard.writeText(configString);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

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
          <span>Back to Backtesting Registry</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#6c7479]">RUN ID:</span>
          <span className="text-xs font-mono text-[#b8f34a] font-bold">{run.id}</span>
        </div>
      </div>

      {/* Header (Section 10) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              BACKTEST EXECUTION AUDIT · {run.type.toUpperCase()}
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              WALK-FORWARD COMPLETED
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            {run.name}
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            {run.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            {copiedConfig ? (
              <>
                <Check size={14} className="text-[#b8f34a]" />
                <span className="text-[#b8f34a]">Configuration Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Run Config</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setLocation('/historical-replay')}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#c8f56a] transition"
          >
            <History size={14} />
            <span>Replay Signature Case →</span>
          </button>
        </div>
      </div>

      {/* Top Banner Disclaimer */}
      <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-xs text-[#8d969b] flex items-center justify-between">
        <span>
          <strong>Validation Result:</strong> Synthetic backtesting metrics calculated across 1,248 evaluated predictions. No look-ahead bias is permitted.
        </span>
        <span className="text-[10px] font-mono text-[#6c7479]">
          Horizon: {run.evaluationHorizon} · Jan 2025 – Dec 2025
        </span>
      </div>

      {/* Primary Metrics Strip (Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Brier Score</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">0.142</span>
            <span className="text-[10px] font-mono text-[#6c7479]">MSE</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">95% CI: 0.129–0.156</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Log Loss</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">0.391</span>
            <span className="text-[10px] font-mono text-[#6c7479]">nats</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Cross-entropy penalty</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Calibration Error (ECE)</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">0.071</span>
            <span className="text-[10px] font-mono text-[#6c7479]">7.1% gap</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">10 decile buckets</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Evaluated Predictions</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">{run.sampleSize.toLocaleString()}</span>
            <span className="text-[10px] font-mono text-[#6c7479]">events</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">100% resolution coverage</div>
        </div>
      </div>

      {/* Provenance Box (Section 60 & 86) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-[#b8f34a]" />
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Reproducibility & Provenance Parameters
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="text-xs text-[#b8f34a] hover:underline"
          >
            Audit Methodology Details
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#6c7479] block text-[10px]">MODEL VERSION</span>
            <span className="text-[#f5f5f2] font-semibold">{run.modelVersion}</span>
          </div>
          <div>
            <span className="text-[#6c7479] block text-[10px]">DATASET VERSION</span>
            <span className="text-[#f5f5f2]">{run.datasetVersion}</span>
          </div>
          <div>
            <span className="text-[#6c7479] block text-[10px]">EVALUATION HORIZON</span>
            <span className="text-[#f5f5f2]">{run.evaluationHorizon}</span>
          </div>
          <div>
            <span className="text-[#6c7479] block text-[10px]">EVALUATION WINDOW</span>
            <span className="text-[#f5f5f2]">365 days (2025)</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#6c7479] block text-[10px]">OUTCOME DEFINITION</span>
            <span className="text-[#a0a8af] font-sans text-xs">{run.outcomeDefinition}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#6c7479] block text-[10px]">LEAKAGE AUDIT</span>
            <span className="text-[#7ee787] flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Zero look-ahead bias verified by temporal isolation protocol</span>
            </span>
          </div>
        </div>
      </div>

      {/* Decile Reliability Curve */}
      <CalibrationCurveChart buckets={calibrationBucketsList} />

      {/* Historical Case Table (Section 54 - 59) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Evaluated Historical Case Sample
            </h3>
            <p className="text-xs text-[#8d969b]">
              Inspect individual predictions, risk scores, early warning lead times, and verified outcomes.
            </p>
          </div>
          <div className="text-xs font-mono text-[#6c7479]">
            Showing sample of 6 events
          </div>
        </div>

        <div className="overflow-x-auto soft-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1f2427] text-[10px] font-mono uppercase text-[#6c7479]">
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Predicted Prob</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Modeled Impact</th>
                <th className="py-2.5 px-3">Observed Outcome</th>
                <th className="py-2.5 px-3">Warning Lead Time</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171a1d]">
              {historicalEventsBacktestTable.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#161a1d] transition">
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#f5f5f2]">{evt.title}</div>
                    <div className="text-[10px] font-mono text-[#6c7479]">
                      {evt.eventId} · {evt.category} · {evt.eventDate}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-[#f5f5f2]">
                    {evt.predictedProbabilityPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span
                      className={`font-semibold ${
                        evt.predictedRiskScore >= 70
                          ? 'text-[#ff5c5c]'
                          : evt.predictedRiskScore >= 50
                          ? 'text-[#e5c07b]'
                          : 'text-[#b8f34a]'
                      }`}
                    >
                      {evt.predictedRiskScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#92989e]">
                    ${evt.modeledImpactUsdM.toFixed(1)}M
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-mono border ${
                        evt.observedOutcome === 'OCCURRED'
                          ? 'bg-[#182619] text-[#7ee787] border-[#2e5030]'
                          : 'bg-[#1f2427] text-[#92989e] border-[#2e353b]'
                      }`}
                    >
                      {evt.observedOutcome}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {evt.warningLeadTimeHours ? (
                      <span className="text-[#b8f34a] font-semibold">
                        +{evt.warningLeadTimeHours.toFixed(1)} hours
                      </span>
                    ) : (
                      <span className="text-[#6c7479]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setLocation('/historical-replay')}
                      className="inline-flex items-center gap-1 rounded bg-[#172016] px-2.5 py-1 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#1f2b1d] transition"
                    >
                      <span>Replay</span>
                      <ArrowRight size={11} />
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
