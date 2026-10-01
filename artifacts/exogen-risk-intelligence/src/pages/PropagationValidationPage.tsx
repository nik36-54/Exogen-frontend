import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GitBranch,
  Network,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function PropagationValidationPage() {
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

        <button
          type="button"
          onClick={() => setLocation('/risk/propagation')}
          className="text-xs text-[#b8f34a] hover:underline flex items-center gap-1"
        >
          <span>Live Propagation View</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Header (Section 38) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              CAUSAL TRANSMISSION ACCURACY · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              421 EVALUATED PATHS
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Propagation Validation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            When Exogen mapped a causal transmission relationship from an external event to a downstream business unit, did the downstream vulnerability empirically materialize?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Path Methodology</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Path Precision</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">71.0%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">299 / 421</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Downstream spike verified</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Path Recall</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">64.0%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">coverage</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Unmapped paths identified</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Lead Time Advantage</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">12.8d</span>
            <span className="text-[10px] font-mono text-[#6c7479]">prior</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Notice before BU margin hit</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Unconfirmed Paths</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#e5c07b]">21.6%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">91 paths</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Sub-threshold impact</div>
        </div>
      </div>

      {/* Case Examples (Section 39) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-3">
          Empirical Transmission Path Case Studies
        </h3>

        <div className="space-y-3">
          {/* Validated Case 1 */}
          <div className="p-4 rounded-lg border border-[#1e2a1d] bg-[#121a13] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f5f5f2]">
                Federal Reserve 50bps Rate Cut → Interest Rate Risk → Commercial Banking Loan/Deposit
              </span>
              <span className="rounded bg-[#182619] px-2 py-0.5 text-[9px] font-mono text-[#7ee787] border border-[#2e5030]">
                VALIDATED (CONFIRMED)
              </span>
            </div>
            <p className="text-xs text-[#a0b39f] leading-relaxed">
              Exogen predicted transmission from the jumbo FOMC cut to commercial bank net interest margin duration mismatch. Observed proxy: Commercial loan repricing accelerated within 72 hours, confirming transmission edge.
            </p>
          </div>

          {/* Validated Case 2 */}
          <div className="p-4 rounded-lg border border-[#1e2a1d] bg-[#121a13] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f5f5f2]">
                Brent Crude Spike &gt;$120 → Energy Commodity Risk → CIB Leveraged Finance Underwriting
              </span>
              <span className="rounded bg-[#182619] px-2 py-0.5 text-[9px] font-mono text-[#7ee787] border border-[#2e5030]">
                VALIDATED (CONFIRMED)
              </span>
            </div>
            <p className="text-xs text-[#a0b39f] leading-relaxed">
              Energy cost escalation triggered pipeline delays in airline and logistics syndicated credit facilities, matching Exogen’s predicted corporate debt transmission hop.
            </p>
          </div>

          {/* Unconfirmed / Not Validated Case */}
          <div className="p-4 rounded-lg border border-[#2b2518] bg-[#1a1711] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f5f5f2]">
                Taiwan Strait Shipping Delay → Logistics Disruption → Payments & Settlements Risk
              </span>
              <span className="rounded bg-[#2b2518] px-2 py-0.5 text-[9px] font-mono text-[#e5c07b] border border-[#4a3c26]">
                NOT VALIDATED (UNCONFIRMED)
              </span>
            </div>
            <p className="text-xs text-[#b8a79a] leading-relaxed">
              Observed outcome: Alternative maritime rerouting mitigated supply chain friction before settlement delays crossed institutional thresholds. The predicted transmission edge was dampened by merchant operational redundancy.
            </p>
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
