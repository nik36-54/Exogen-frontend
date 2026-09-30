import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  GitBranch,
  Layers,
  Network,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { primaryFedTransmissionGraph } from '@/data/risk-intelligence-data';
import { TransmissionGraphVisualizer } from '@/components/risk/TransmissionGraphVisualizer';

export default function RiskTransmissionPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-7">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLocation('/risk')}
          className="flex items-center gap-1.5 text-[11px] text-[#869197] hover:text-[#dce1dc] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Risk Intelligence</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/risk-graph')}
          className="flex items-center gap-1.5 rounded border border-[#485c33] bg-[#1a2516] px-3 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#22311c]"
        >
          <Network size={13} />
          <span>Open Full Interactive Risk Graph</span>
        </button>
      </div>

      {/* Header (Section 13) */}
      <div>
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            MECHANISTIC PROPAGATION
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Risk Transmission
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Trace how external events propagate through economic mechanisms into company-specific exposure.
        </p>
      </div>

      {/* Multi-Path Visual Graph Component (Section 13-18) */}
      <TransmissionGraphVisualizer
        graphData={primaryFedTransmissionGraph}
        onSelectBusinessUnit={(unitId) => setLocation(`/exposure/business-unit/${unitId}`)}
      />

      {/* Multi-Path Risk Explanation Card (Section 18) */}
      <section className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6 text-[11px]">
        <div className="border-b border-[#1f2427] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            ASYMMETRIC BRANCHING
          </span>
          <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
            Multi-Path Propagation Mechanisms
          </h2>
          <p className="mt-1 text-[12px] text-[#8e989d]">
            A single external policy shock does not affect all business units uniformly. Exogen separates concurrent transmission branches:
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[6px] border border-[#262c31] bg-[#0c0f11] p-4">
            <span className="mono text-[9px] font-semibold text-[#8ca3b8]">BRANCH 01 · WHOLESALE LENDING</span>
            <div className="mt-2 text-[13px] font-medium text-[#edf1eb]">Deposit Pricing & NIM Compression</div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#949ea4]">
              Rate-sensitive commercial deposits face sticky competitive rate floors while floating syndications reset lower, creating a direct $6.8M contraction in Commercial Banking net interest income.
            </p>
            <div className="mt-3 text-[10px] font-semibold text-[#ff6b6b]">Direction: Negative (-$6.8M)</div>
          </div>

          <div className="rounded-[6px] border border-[#262c31] bg-[#0c0f11] p-4">
            <span className="mono text-[9px] font-semibold text-[#8ca3b8]">BRANCH 02 · TRADING & CAPITAL MARKETS</span>
            <div className="mt-2 text-[13px] font-medium text-[#edf1eb]">Yield Curve Shifts & Hedging Surges</div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#949ea4]">
              Steepening yield curve boosts fixed income bond inventory valuations, while corporate debt issuance increases client underwriting fees, offsetting derivative duration risks.
            </p>
            <div className="mt-3 text-[10px] font-semibold text-[#f5c76c]">Direction: Mixed (±$5.1M)</div>
          </div>

          <div className="rounded-[6px] border border-[#262c31] bg-[#0c0f11] p-4">
            <span className="mono text-[9px] font-semibold text-[#8ca3b8]">BRANCH 03 · RETAIL & MORTGAGE</span>
            <div className="mt-2 text-[13px] font-medium text-[#edf1eb]">Consumer Affordability & Refinancing</div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#949ea4]">
              Lower borrowing rates improve retail customer debt servicing metrics and unlock pent-up residential mortgage loan refinancing applications in Consumer Banking.
            </p>
            <div className="mt-3 text-[10px] font-semibold text-[#b8f34a]">Direction: Positive (+$2.8M)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
