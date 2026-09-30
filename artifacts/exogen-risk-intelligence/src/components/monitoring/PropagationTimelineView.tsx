import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  GitBranch,
  Briefcase,
  DollarSign,
  Info,
} from 'lucide-react';
import type { RiskPropagationRecord } from '@/types/monitoring-intelligence';

interface Props {
  record: RiskPropagationRecord;
}

export function PropagationTimelineView({ record }: Props) {
  const [, setLocation] = useLocation();
  const [selectedDepth, setSelectedDepth] = useState<number>(record.depth);

  return (
    <div className="space-y-6">
      {/* Velocity Telemetry Banner (Section 18) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              PROPAGATION TELEMETRY
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Risk Propagation Velocity
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#171a1d] px-2 py-0.5 text-[10px] font-mono text-[#92989e] border border-[#24282c]">
              TOTAL VELOCITY: {record.totalPropagationVelocityMin} MINUTES
            </span>
            <span className="rounded bg-[#7c8cff]/10 px-2 py-0.5 text-[10px] font-mono text-[#7c8cff]">
              DEPTH: {record.depth} STAGES
            </span>
          </div>
        </div>

        {/* Velocity Phase Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {record.velocityBreakdown.map((vb) => (
            <div key={vb.phase} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
              <div className="text-[10px] font-mono text-[#656b70]">{vb.phase}</div>
              <div className="mt-1 text-lg font-mono font-bold text-[#b8f34a]">{vb.minutes} min</div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-[10px] font-mono text-[#656b70]">
          * Illustrative propagation telemetry representing simulated cross-subsystem event propagation latency.
        </div>
      </div>

      {/* Chronological Propagation Timeline (Section 17) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              CHRONOLOGICAL CASCADE
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Propagation Timeline
            </h3>
          </div>
          <div className="text-xs font-mono text-[#656b70]">
            7 INTERCONNECTED STAGES
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {record.steps.map((step, idx) => (
            <div key={step.stepNumber} className="relative flex items-start gap-4 group">
              {/* Vertical connector line */}
              {idx < record.steps.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-[#24282c] group-hover:bg-[#3b4440]" />
              )}

              {/* Number Badge */}
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#24282c] bg-[#171a1d] text-xs font-mono font-bold text-[#f5f5f2] group-hover:border-[#b8f34a] group-hover:text-[#b8f34a]">
                0{step.stepNumber}
              </div>

              {/* Content Card */}
              <div className="flex-1 rounded-lg border border-[#24282c] bg-[#171a1d] p-4 text-xs transition group-hover:border-[#3b4440]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f5f5f2]">{step.title}</span>
                    <span className="rounded bg-[#0a0a0b] px-1.5 py-0.2 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
                      {step.nodeType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#656b70]">
                    <Clock className="h-3 w-3" />
                    <span>{step.timestamp}</span>
                    <span>(+{step.latencyMinutes}m)</span>
                    <span className="text-[#b8f34a]">({step.confidencePct}% conf)</span>
                  </div>
                </div>

                <p className="mt-1.5 text-[11px] text-[#92989e] leading-relaxed">
                  {step.detail}
                </p>

                {step.amountUsdM && (
                  <div className="mt-2 font-mono text-[11px] text-[#b8f34a] font-bold">
                    Modeled Amount: ${step.amountUsdM.toFixed(1)}M
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Propagation Depth Hierarchy (Section 19) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="border-b border-[#24282c] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            SYSTEMIC REACH
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Propagation Depth Hierarchy
          </h3>
          <p className="mt-1 text-xs text-[#92989e]">
            Differentiates immediate first-order interest rate sensitivity from multi-stage cascading client and market reactions.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {record.depthHierarchy.map((dh) => (
            <div
              key={dh.depthLevel}
              onClick={() => setSelectedDepth(dh.depthLevel)}
              className={`rounded-lg border p-3 cursor-pointer transition ${
                selectedDepth === dh.depthLevel
                  ? 'border-[#b8f34a] bg-[#b8f34a]/10'
                  : 'border-[#24282c] bg-[#171a1d] hover:border-[#3b4440]'
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-[#b8f34a]">
                DEPTH 0{dh.depthLevel}
              </div>
              <div className="mt-1 text-xs font-semibold text-[#f5f5f2]">{dh.title}</div>
              <p className="mt-1 text-[11px] text-[#92989e]">{dh.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
