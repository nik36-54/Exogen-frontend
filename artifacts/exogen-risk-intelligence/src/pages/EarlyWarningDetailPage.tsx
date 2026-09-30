import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Sparkles,
  FileCheck2,
  GitBranch,
  Network,
  BriefcaseBusiness,
  DollarSign,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { earlyWarningsList } from '@/data/monitoring-intelligence-data';
import { ChangeTimelineView } from '@/components/monitoring/ChangeTimelineView';
import type { WarningStatus } from '@/types/monitoring-intelligence';

interface Props {
  warningId: string;
}

export default function EarlyWarningDetailPage({ warningId }: Props) {
  const [, setLocation] = useLocation();
  const warning =
    earlyWarningsList.find((w) => w.id === warningId) || earlyWarningsList[0];

  const [currentStatus, setCurrentStatus] = useState<WarningStatus>(warning.status);
  const [statusHistory, setStatusHistory] = useState(warning.statusHistory);

  const handleUpdateStatus = (newStatus: WarningStatus) => {
    setCurrentStatus(newStatus);
    setStatusHistory((prev) => [
      ...prev,
      {
        status: newStatus,
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        actor: 'Risk Operations Lead',
        note: `Transitioned state to ${newStatus.toUpperCase()}`,
      },
    ]);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setLocation('/early-warnings')}
          className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Early Warnings
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#656b70]">RULE: {warning.triggeredRuleId}</span>
          <span className="text-[10px] font-mono text-[#b8f34a]">CONFIDENCE: {warning.confidencePct}%</span>
        </div>
      </div>

      {/* Hero Header (Section 12) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#b8f34a]/10 px-2 py-0.5 text-xs font-mono font-bold uppercase text-[#b8f34a] border border-[#b8f34a]/30">
                {warning.severity} SEVERITY
              </span>
              <span className="text-xs font-mono text-[#92989e]">· {warning.type}</span>
              <span className="text-xs font-mono text-[#656b70]">· Detected {warning.timeAgo}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
              {warning.eventTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#92989e]">
              <span>Risk: <strong className="text-[#f5f5f2]">{warning.riskName}</strong></span>
              <span>·</span>
              <span>Unit: <strong className="text-[#f5f5f2]">{warning.businessUnitName}</strong></span>
              <span>·</span>
              <span>Company: <strong className="text-[#f5f5f2]">{warning.companyName}</strong></span>
            </div>
          </div>

          {/* Status Control */}
          <div className="rounded-xl border border-[#24282c] bg-[#0a0a0b] p-4 space-y-2 shrink-0">
            <div className="text-[10px] font-mono uppercase text-[#92989e]">
              INVESTIGATION STATUS
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {(['new', 'acknowledged', 'investigating', 'resolved'] as WarningStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`rounded px-2 py-1 uppercase text-[10px] font-bold transition ${
                    currentStatus === st
                      ? 'bg-[#b8f34a] text-[#0a0a0b]'
                      : 'bg-[#171a1d] text-[#92989e] hover:text-[#f5f5f2]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* What Changed Grid (Section 12) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#24282c] pt-6">
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">PROBABILITY SHIFT</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#b8f34a]">
              {warning.previousValue} → {warning.currentValue}
            </div>
            <div className="text-[10px] font-mono text-[#ff5c5c] font-semibold">{warning.changeValue} in 4h</div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">RISK SCORE ESCALATION</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              {warning.previousRiskScore} → {warning.riskScore}
            </div>
            <div className="text-[10px] font-mono text-[#ff5c5c] font-semibold">
              +{warning.riskScore - warning.previousRiskScore} pts (MEDIUM → HIGH)
            </div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">EXPOSURE EXPANSION</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#f5f5f2]">
              ${warning.previousExposureUsdM.toFixed(1)}M → ${warning.exposureUsdM.toFixed(1)}M
            </div>
            <div className="text-[10px] font-mono text-[#ff5c5c] font-semibold">
              +${(warning.exposureUsdM - warning.previousExposureUsdM).toFixed(1)}M revision
            </div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
            <div className="text-[10px] font-mono text-[#92989e]">DOWNSIDE IMPACT DELTA</div>
            <div className="mt-1 text-lg font-mono font-bold text-[#ff5c5c]">
              ${warning.previousImpactUsdM.toFixed(1)}M → ${warning.potentialImpactUsdM.toFixed(1)}M
            </div>
            <div className="text-[10px] font-mono text-[#ff5c5c] font-semibold">
              +${(warning.potentialImpactUsdM - warning.previousImpactUsdM).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: "Why this warning exists" & Status Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Why this warning exists (Section 13) */}
        <div className="lg:col-span-7 rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
          <div className="border-b border-[#24282c] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              EXPLAINABILITY SENTINEL
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Why Exogen Generated This Warning
            </h2>
          </div>

          <p className="text-xs text-[#92989e] leading-relaxed">
            The sentinel engine evaluates multi-dimensional event thresholds to ensure no black-box alerts are delivered without evidentiary backing:
          </p>

          <div className="space-y-2.5">
            {warning.whyGeneratedReasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b8f34a]/10 font-mono text-[10px] font-bold text-[#b8f34a]">
                  0{idx + 1}
                </div>
                <div className="text-[#f5f5f2] leading-relaxed pt-0.5">{reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Audit History & Non-destructive status */}
        <div className="lg:col-span-5 rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
          <div className="border-b border-[#24282c] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              AUDIT LOG
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Status History (Non-Destructive)
            </h3>
          </div>

          <div className="space-y-2">
            {statusHistory.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#b8f34a] uppercase">{item.status}</span>
                  <span className="text-[#656b70]">{item.timestamp}</span>
                </div>
                <div className="text-[11px] text-[#f5f5f2]">{item.note}</div>
                <div className="text-[10px] text-[#656b70]">By {item.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Detection Timeline (Section 41) */}
      <ChangeTimelineView eventId={warning.canonicalEventId} />

      {/* Actionable Investigation Flow (Section 14 & 52) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="border-b border-[#24282c] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
            CLOSED LOOP INVESTIGATION
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Warning Provenance & Drilldown Links
          </h3>
          <p className="mt-1 text-xs text-[#92989e]">
            Seamlessly navigate down through the complete analytical and provenance stack.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setLocation(`/events/${warning.canonicalEventId}`)}
            className="flex flex-col justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#656b70]">PROVENANCE 01</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              Canonical Event →
            </div>
          </button>

          <button
            onClick={() => setLocation('/matching')}
            className="flex flex-col justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#656b70]">PROVENANCE 02</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              Contract Matching →
            </div>
          </button>

          <button
            onClick={() => setLocation(`/risk/scores/${warning.riskId}`)}
            className="flex flex-col justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#656b70]">PROVENANCE 03</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              Risk Score Detail →
            </div>
          </button>

          <button
            onClick={() => setLocation('/risk/propagation/PROP-FED-RATE-CUT')}
            className="flex flex-col justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#656b70]">PROVENANCE 04</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              Risk Propagation →
            </div>
          </button>

          <button
            onClick={() => setLocation('/exposure')}
            className="flex flex-col justify-between rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#656b70]">PROVENANCE 05</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              BU Exposure Map →
            </div>
          </button>

          <button
            onClick={() => setLocation('/impact/IMP-FED-RATE-CUT')}
            className="flex flex-col justify-between rounded-lg border border-[#b8f34a]/30 bg-[#b8f34a]/5 p-3 text-left hover:border-[#b8f34a] transition group"
          >
            <div className="text-[9px] font-mono text-[#b8f34a]">PROVENANCE 06</div>
            <div className="text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] mt-2">
              Dollar Impact ($18.4M) →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
