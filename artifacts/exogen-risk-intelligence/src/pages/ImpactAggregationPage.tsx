import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Layers,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Network,
  HelpCircle,
  BriefcaseBusiness,
} from 'lucide-react';
import { getImpactAggregation } from '@/data/quantitative-intelligence-data';

export default function ImpactAggregationPage() {
  const [, setLocation] = useLocation();
  const summary = getImpactAggregation();

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              QUANTITATIVE RISK INTELLIGENCE · LAYER 05
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              CORPORATE AGGREGATION
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Impact Aggregation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Consolidated enterprise-wide exposure and potential financial loss across events, risk categories, and business units with overlap intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation('/impact')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#111416] px-3.5 py-2 text-xs font-medium text-[#92989e] hover:text-[#f5f5f2]"
          >
            ← Dollar Impact Directory
          </button>
        </div>
      </div>

      {/* JPMorgan Chase Top Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            {summary.companyName.toUpperCase()} · TOTAL MODELED EXPOSURE
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#f5f5f2]">
            ${summary.totalModeledExposureUsdM.toFixed(1)}M
          </div>
          <div className="mt-1 text-[11px] text-[#656b70]">
            Gross balance sheet sensitivity mapped across 4 corporate business units
          </div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            EXPECTED IMPACT (PROB-WEIGHTED)
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#b8f34a]">
            ${summary.expectedImpactUsdM.toFixed(1)}M
          </div>
          <div className="mt-1 text-[11px] text-[#656b70]">
            Consolidated probability-adjusted consequence across all live events
          </div>
        </div>

        <div className="rounded-xl border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff5c5c]">
            DOWNSIDE IMPACT (STRESSED)
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#ff5c5c]">
            ${summary.downsideImpactUsdM.toFixed(1)}M
          </div>
          <div className="mt-1 text-[11px] text-[#92989e]">
            Aggregate loss under concurrent downside scenario realizations
          </div>
        </div>
      </div>

      {/* Double Counting Warning & Aggregation Integrity (Section 32 & 57) */}
      <div className="rounded-xl border border-[#b8f34a]/30 bg-[#111416] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#b8f34a]" />
            <h2 className="text-base font-semibold text-[#f5f5f2]">
              Aggregation Integrity & Overlap Adjustment
            </h2>
          </div>
          <span className="rounded bg-[#b8f34a]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#b8f34a]">
            ILLUSTRATIVE AGGREGATION MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-2 text-xs text-[#92989e] leading-relaxed">
            <div className="text-sm font-semibold text-[#f5f5f2]">
              Potential Overlap Detected ({summary.overlapIntegrity.eventsCount} Events)
            </div>
            <p>
              {summary.overlapIntegrity.explanation} Naive summation assumes independence between events that share underlying duration and deposit beta exposure. Exogen discounts correlated interest rate shocks.
            </p>
            <div className="mt-2 text-[11px] font-mono text-[#656b70]">
              Affected events: {summary.overlapIntegrity.affectedEvents.join(' · ')}
            </div>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b] p-4 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[#92989e]">
              <span>Naive Aggregation:</span>
              <span className="text-[#f5f5f2] font-semibold">${summary.overlapIntegrity.naiveUsdM.toFixed(1)}M</span>
            </div>
            <div className="flex items-center justify-between text-[#ff5c5c]">
              <span>Overlap Adjustment:</span>
              <span className="font-semibold">-${summary.overlapIntegrity.overlapUsdM.toFixed(1)}M</span>
            </div>
            <div className="flex items-center justify-between border-t border-[#24282c] pt-2 text-[#b8f34a]">
              <span>Adjusted Modeled Exposure:</span>
              <span className="text-base font-bold">${summary.overlapIntegrity.adjustedUsdM.toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Correlated Risks Warning (Section 33) */}
      <div className="rounded-xl border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-5">
        <div className="flex items-center justify-between border-b border-[#ff5c5c]/20 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#ff5c5c]" />
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Correlated Risks Clusters
            </h3>
          </div>
          <button
            onClick={() => setLocation('/risk-graph')}
            className="inline-flex items-center gap-1 text-xs text-[#ff5c5c] hover:underline"
          >
            Explore correlated risks in Risk Graph →
          </button>
        </div>

        <p className="mt-3 text-xs text-[#92989e] leading-relaxed">
          These external risks share common macroeconomic drivers. When one event crystallizes, joint scenario analysis is required to avert compounding systemic strain:
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {summary.correlatedRisks.map((cluster) => (
            <div
              key={cluster.id}
              className="rounded-lg border border-[#24282c] bg-[#111416] p-4 text-xs space-y-2"
            >
              <div className="font-semibold text-[#f5f5f2]">{cluster.title}</div>
              <div className="flex flex-wrap gap-1.5">
                {cluster.risks.map((r, i) => (
                  <span
                    key={i}
                    className="rounded bg-[#171a1d] px-2 py-0.5 text-[10px] font-mono text-[#b8f34a] border border-[#24282c]"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#92989e]">{cluster.driverSummary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown by Risk and Business Unit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Risk Category */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="border-b border-[#24282c] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              EXPOSURE BY RISK CLASS
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Risk Category Aggregation
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {summary.byRisk.map((rc) => (
              <div key={rc.risk} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs">
                <div className="flex items-center justify-between font-medium text-[#f5f5f2]">
                  <span>{rc.risk}</span>
                  <span className="font-mono text-[#b8f34a]">${rc.amountUsdM.toFixed(1)}M ({rc.percentage}%)</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#0a0a0b] overflow-hidden">
                  <div className="h-full rounded-full bg-[#b8f34a]" style={{ width: `${rc.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Business Unit */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="border-b border-[#24282c] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              EXPOSURE BY OPERATING DIVISION
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Business Unit Aggregation
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            {summary.byBusinessUnit.map((bu) => (
              <div key={bu.unit} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs">
                <div className="flex items-center justify-between font-medium text-[#f5f5f2]">
                  <span>{bu.unit}</span>
                  <span className="font-mono text-[#7c8cff]">${bu.amountUsdM.toFixed(1)}M ({bu.percentage}%)</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#0a0a0b] overflow-hidden">
                  <div className="h-full rounded-full bg-[#7c8cff]" style={{ width: `${bu.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
