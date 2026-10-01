import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  GitBranch,
  History,
  Layers,
  Network,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  historicalEventsBacktestTable,
  signatureFedReplayEvent,
} from '@/data/validation-intelligence-data';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

interface Props {
  eventId: string;
}

export default function HistoricalEventDetailPage({ eventId }: Props) {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const eventRecord =
    historicalEventsBacktestTable.find((e) => e.eventId === eventId) ||
    historicalEventsBacktestTable[0];

  const ticks = signatureFedReplayEvent.ticks;

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

        <span className="text-[10px] font-mono text-[#6c7479]">FORENSIC AUDIT · {eventRecord.eventId}</span>
      </div>

      {/* Header (Section 54) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              HISTORICAL EVENT FORENSICS · 30-DAY HORIZON
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              OUTCOME RESOLVED
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            {eventRecord.title}
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            {eventRecord.notes}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setLocation('/historical-replay')}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#c8f56a] transition"
          >
            <History size={14} />
            <span>Interactive Historical Replay →</span>
          </button>
        </div>
      </div>

      {/* Forensic Metrics Strip (Section 56 & 57) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Pre-Event Consensus</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">
              {eventRecord.predictedProbabilityPct.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#6c7479]">at T-24h</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Polymarket & Kalshi</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Peak Risk Score</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#ff5c5c]">
              {eventRecord.predictedRiskScore}
            </span>
            <span className="text-[10px] font-mono text-[#6c7479]">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Threshold: 70</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Verified Outcome</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#7ee787]">
              {eventRecord.observedOutcome}
            </span>
            <span className="text-[10px] font-mono text-[#6c7479]">binary 1</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Fed Statement H.15</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Warning Lead Time</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">
              {eventRecord.warningLeadTimeHours ? `${eventRecord.warningLeadTimeHours}h` : 'None'}
            </span>
            <span className="text-[10px] font-mono text-[#6c7479]">advance</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Fired at Risk Score 72</div>
        </div>
      </div>

      {/* Prediction Evolution Steps (Section 55 - 58) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-3">
          Chronological Belief & Risk Evolution (T-77h to T-0)
        </h3>

        <div className="overflow-x-auto soft-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1f2427] text-[10px] font-mono uppercase text-[#6c7479]">
                <th className="py-2.5 px-3">Horizon Mark</th>
                <th className="py-2.5 px-3">Probability</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Modeled Exposure</th>
                <th className="py-2.5 px-3">Downside Impact</th>
                <th className="py-2.5 px-3">Sentinel State</th>
                <th className="py-2.5 px-3">Key Observation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171a1d] font-mono">
              {ticks.map((t) => (
                <tr key={t.label} className="hover:bg-[#161a1d] transition">
                  <td className="py-3 px-3 font-semibold text-[#f5f5f2]">{t.label}</td>
                  <td className="py-3 px-3 text-[#b8f34a] font-bold">{t.probabilityPct.toFixed(1)}%</td>
                  <td className="py-3 px-3">
                    <span className={t.riskScore >= 70 ? 'text-[#ff5c5c] font-bold' : 'text-[#f5f5f2]'}>
                      {t.riskScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#92989e]">${t.modeledExposureUsdM.toFixed(1)}M</td>
                  <td className="py-3 px-3 text-[#92989e]">${t.potentialImpactUsdM.toFixed(1)}M</td>
                  <td className="py-3 px-3 font-sans">
                    {t.warningTriggered ? (
                      <span className="inline-flex items-center gap-1 rounded bg-[#331414] px-2 py-0.5 text-[9px] font-mono text-[#ff7b72] border border-[#522323]">
                        <ShieldAlert size={10} />
                        <span>WARNING FIRED</span>
                      </span>
                    ) : t.hoursFromResolution === 0 ? (
                      <span className="inline-flex items-center gap-1 rounded bg-[#182619] px-2 py-0.5 text-[9px] font-mono text-[#7ee787] border border-[#2e5030]">
                        <CheckCircle2 size={10} />
                        <span>RESOLVED</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6c7479]">Monitoring</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans text-[#8d969b] text-[11px] max-w-sm truncate">
                    {t.summaryNote}
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
