import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Network,
  BriefcaseBusiness,
  HelpCircle,
  Clock,
  Sliders,
  DollarSign,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  getRiskScore,
  getRiskScoreHistory,
  significantEventsLogs,
} from '@/data/quantitative-intelligence-data';
import { RiskScoreComposition } from '@/components/quantitative/RiskScoreComposition';
import { ScoreMethodologyDrawer } from '@/components/quantitative/ScoreMethodologyDrawer';
import { RiskThresholdConfigDrawer } from '@/components/quantitative/RiskThresholdConfigDrawer';

interface Props {
  riskId: string;
}

export default function RiskScoreDetailPage({ riskId }: Props) {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const [historyRange, setHistoryRange] = useState<'24H' | '7D' | '30D' | '90D'>('24H');

  const risk = getRiskScore(riskId);

  if (!risk) {
    return (
      <div className="mx-auto max-w-4xl p-8 text-center">
        <h2 className="text-xl font-bold text-[#f5f5f2]">Risk Score Not Found</h2>
        <p className="mt-2 text-sm text-[#92989e]">
          No quantitative score record matches identifier "{riskId}".
        </p>
        <button
          onClick={() => setLocation('/risk/scores')}
          className="mt-4 rounded bg-[#b8f34a] px-4 py-2 text-xs font-semibold text-[#0a0a0b]"
        >
          Return to Risk Scores
        </button>
      </div>
    );
  }

  const historyPoints = getRiskScoreHistory(risk.id, historyRange);

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setLocation('/risk/scores')}
          className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Risk Scores
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#656b70]">MODEL: {risk.methodologyVersion}</span>
          <button
            onClick={() => setMethodologyOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-[#b8f34a] hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Methodology
          </button>
        </div>
      </div>

      {/* Hero Header: Risk Score Banner */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                EXOGEN RISK SCORE · INSTITUTIONAL RECORD
              </span>
              <span className="text-[10px] font-mono text-[#656b70]">({risk.id})</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
              {risk.eventTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#92989e]">
              <span>Risk: <strong className="text-[#f5f5f2]">{risk.riskName}</strong></span>
              <span>·</span>
              <span>Category: <strong className="text-[#f5f5f2]">{risk.riskCategory}</strong></span>
              <span>·</span>
              <span>Target: <strong className="text-[#f5f5f2]">{risk.companyName}</strong></span>
            </div>
          </div>

          {/* Big Score Callout */}
          <div className="flex items-center gap-5 rounded-xl border border-[#24282c] bg-[#0a0a0b] p-5 shrink-0">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                COMPOSITE SCORE
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-mono font-bold text-[#b8f34a]">
                  {risk.score}
                </span>
                <span className="text-sm font-mono text-[#656b70]">/ 100</span>
              </div>
            </div>

            <div className="h-12 w-px bg-[#24282c]" />

            <div>
              <span
                className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                  risk.score >= 70
                    ? 'bg-[#b8f34a]/10 text-[#b8f34a] border border-[#b8f34a]/30'
                    : 'bg-[#7c8cff]/10 text-[#7c8cff] border border-[#7c8cff]/30'
                }`}
              >
                {risk.category}
              </span>
              <div className="mt-1 text-xs font-mono text-[#ff5c5c]">
                +{risk.scoreChange24h} points vs 24h ago
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-[#24282c] pt-6">
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">PROBABILITY</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              {risk.probabilityPct.toFixed(1)}%
            </div>
            <div className="text-[9px] font-mono text-[#656b70]">Market Consensus</div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">SEVERITY</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              {risk.severity}
            </div>
            <div className="text-[9px] font-mono text-[#656b70]">Consequence Model</div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">EXPOSURE</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              {risk.exposureScore}
            </div>
            <div className="text-[9px] font-mono text-[#656b70]">${risk.modeledExposureUsdM.toFixed(1)}M Baseline</div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">PROPAGATION</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              {risk.propagationScore}
            </div>
            <div className="text-[9px] font-mono text-[#656b70]">Transmission Graph</div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-[#92989e]">CONFIDENCE</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#7c8cff]">
              {risk.confidencePct}%
            </div>
            <div className="text-[9px] font-mono text-[#656b70]">Evidence Quality</div>
          </div>
        </div>
      </div>

      {/* Composition & Drivers Visualizer */}
      <RiskScoreComposition
        score={risk.score}
        category={risk.category}
        drivers={risk.drivers}
        onOpenMethodology={() => setMethodologyOpen(true)}
      />

      {/* Explainability Section: "Why is this risk significant?" & Score Change Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why is this risk significant? */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="border-b border-[#24282c] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              EXPLAINABILITY LAYER
            </span>
            <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
              Why is this risk significant?
            </h3>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#92989e]">
            {risk.whyExplanation.summary}
          </p>

          <div className="mt-4 space-y-2.5">
            {risk.whyExplanation.primaryDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-start gap-3 rounded-lg border border-[#24282c] bg-[#171a1d] p-3"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b8f34a]/10 text-[10px] font-mono font-bold text-[#b8f34a]">
                  {driver.id}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#f5f5f2]">{driver.title}</div>
                  <div className="mt-0.5 text-[11px] text-[#92989e] leading-relaxed">
                    {driver.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Change Explanation: "What changed?" */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                  CHANGE ATTRIBUTION (24H)
                </span>
                <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
                  What changed?
                </h3>
              </div>
              <div className="rounded bg-[#ff5c5c]/10 px-2 py-0.5 text-xs font-mono font-bold text-[#ff5c5c]">
                +{risk.scoreChange24h} points (69 → {risk.score})
              </div>
            </div>

            <p className="mt-3 text-xs text-[#92989e] leading-relaxed">
              Factor-by-factor decomposition explaining why the composite score shifted upward over the last 24 hours:
            </p>

            <div className="mt-4 divide-y divide-[#1e2225] rounded-lg border border-[#24282c] bg-[#171a1d]">
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Probability Shift</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+{risk.changeDecomposition.probabilityChange}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Exposure Model Refresh</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+{risk.changeDecomposition.exposureChange}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Propagation Velocity</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+{risk.changeDecomposition.propagationChange}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Confidence Variance</span>
                <span className="font-mono font-semibold text-[#b8f34a]">{risk.changeDecomposition.confidenceChange}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs bg-[#0a0a0b]/60">
                <span className="font-bold text-[#f5f5f2]">Net 24h Movement</span>
                <span className="font-mono font-bold text-[#ff5c5c]">+{risk.changeDecomposition.netChange} points</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-[#656b70]">
            Change attribution generated dynamically by diffing parameter snapshots at 2026-09-29 11:00 vs 2026-09-30 11:00 UTC.
          </div>
        </div>
      </div>

      {/* Risk Score History & Timeline */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              LONGITUDINAL TRACKING
            </span>
            <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
              Risk Score History
            </h3>
          </div>

          {/* Time range selector */}
          <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
            {(['24H', '7D', '30D', '90D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setHistoryRange(r)}
                className={`px-3 py-1 rounded-md transition ${
                  historyRange === r
                    ? 'bg-[#171a1d] text-[#f5f5f2]'
                    : 'text-[#92989e] hover:text-[#f5f5f2]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* History Line Visualizer */}
        <div className="mt-6 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#92989e] mb-3">
            <span>HISTORICAL SCORE TRAJECTORY</span>
            <span className="text-[#b8f34a]">CURRENT: {risk.score}</span>
          </div>

          <div className="relative h-44 flex items-end gap-2 sm:gap-4 pt-6 border-b border-[#24282c]">
            {historyPoints.map((pt, idx) => {
              const heightPct = Math.max(20, Math.min(100, (pt.score / 100) * 100));
              const isLatest = idx === historyPoints.length - 1;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[9px] font-mono text-[#92989e] opacity-0 group-hover:opacity-100 transition">
                    {pt.score}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      isLatest ? 'bg-[#b8f34a]' : 'bg-[#7c8cff]/40 group-hover:bg-[#7c8cff]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="mt-1 text-[9px] font-mono text-[#656b70] truncate max-w-[45px]">
                    {pt.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#656b70]">
            <span>Low: {Math.min(...historyPoints.map((p) => p.score))}</span>
            <span>High: {Math.max(...historyPoints.map((p) => p.score))}</span>
            <span>Range: {historyRange}</span>
          </div>
        </div>

        {/* Significant Events Timeline */}
        <div className="mt-6">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#92989e] mb-3">
            Intraday Milestone Log (Chronological)
          </div>

          <div className="space-y-2">
            {significantEventsLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs"
              >
                <span className="font-mono text-[11px] font-bold text-[#b8f34a] shrink-0">
                  {log.time}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f5f5f2]">{log.title}</span>
                    <span className="text-[9px] font-mono rounded bg-[#0a0a0b] px-1.5 py-0.2 text-[#92989e] border border-[#24282c]">
                      {log.category}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#92989e] leading-relaxed">
                    {log.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Navigation Loop Shortcuts */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="border-b border-[#24282c] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            INTELLIGENCE CHAIN DRILLDOWN
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Connected Exploration
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setLocation(`/events/${risk.canonicalEventId}`)}
            className="flex items-center justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 text-left transition hover:border-[#b8f34a] hover:bg-[#1e2225]"
          >
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">STEP 02 · EVENT</div>
              <div className="text-xs font-semibold text-[#f5f5f2] mt-0.5">Inspect Canonical Event</div>
            </div>
            <Sparkles className="h-4 w-4 text-[#b8f34a]" />
          </button>

          <button
            onClick={() => setLocation('/risk/transmission')}
            className="flex items-center justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 text-left transition hover:border-[#b8f34a] hover:bg-[#1e2225]"
          >
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">STEP 04 · TRANSMISSION</div>
              <div className="text-xs font-semibold text-[#f5f5f2] mt-0.5">View Transmission Graph</div>
            </div>
            <Network className="h-4 w-4 text-[#b8f34a]" />
          </button>

          <button
            onClick={() => setLocation('/exposure')}
            className="flex items-center justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 text-left transition hover:border-[#b8f34a] hover:bg-[#1e2225]"
          >
            <div>
              <div className="text-[10px] font-mono text-[#656b70]">STEP 05 · EXPOSURE</div>
              <div className="text-xs font-semibold text-[#f5f5f2] mt-0.5">View Business Unit Exposure</div>
            </div>
            <BriefcaseBusiness className="h-4 w-4 text-[#b8f34a]" />
          </button>

          <button
            onClick={() => setLocation('/impact')}
            className="flex items-center justify-between rounded-lg border border-[#b8f34a]/30 bg-[#b8f34a]/5 p-3.5 text-left transition hover:border-[#b8f34a] hover:bg-[#b8f34a]/10"
          >
            <div>
              <div className="text-[10px] font-mono text-[#b8f34a]">STEP 07 · DOLLAR IMPACT</div>
              <div className="text-xs font-semibold text-[#f5f5f2] mt-0.5">View Dollar Impact ($18.4M)</div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#b8f34a]" />
          </button>
        </div>
      </div>

      {/* Drawers */}
      <ScoreMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
      <RiskThresholdConfigDrawer
        isOpen={thresholdsOpen}
        onClose={() => setThresholdsOpen(false)}
      />
    </div>
  );
}
