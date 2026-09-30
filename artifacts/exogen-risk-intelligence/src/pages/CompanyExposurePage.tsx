import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  ChevronRight,
  DollarSign,
  ExternalLink,
  Layers,
  Network,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  businessUnitsList,
  eventBusinessUnitMatrixData,
  riskOverviewKPIs,
} from '@/data/risk-intelligence-data';
import { EventBusinessUnitMatrix } from '@/components/risk/EventBusinessUnitMatrix';

export default function CompanyExposurePage() {
  const [, setLocation] = useLocation();
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  const divisions = [
    'ALL',
    'Commercial & Investment Bank',
    'Consumer & Community Banking',
    'Asset & Wealth Management',
  ];

  const filteredUnits = businessUnitsList.filter((u) => {
    if (selectedDivision === 'ALL') return true;
    return u.division === selectedDivision;
  });

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

        <span className="mono rounded border border-[#2b3337] bg-[#14181a] px-3 py-1 text-[10px] text-[#939da2]">
          JPMorgan Chase & Co. · Simplified Demo Taxonomy
        </span>
      </div>

      {/* Header (Section 19) */}
      <div>
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            FIRM BALANCE SHEET MAPPING
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Company Exposure
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Map external risks to specific JPMorgan business units and modeled financial exposure.
        </p>
      </div>

      {/* Top KPI Cards (Section 19) */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-4 text-left">
          <span className="text-[9px] font-semibold tracking-[.12em] text-[#6b767b]">
            TOTAL MODELED EXPOSURE
          </span>
          <div className="mono mt-1 text-[24px] font-semibold text-[#b8f34a]">
            ${riskOverviewKPIs.totalModeledExposureUsdM.toFixed(1)}M
          </div>
          <span className="text-[9px] text-[#606a70]">Illustrative sensitivity</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-4 text-left">
          <span className="text-[9px] font-semibold tracking-[.12em] text-[#6b767b]">ACTIVE EVENTS</span>
          <div className="mono mt-1 text-[24px] font-semibold text-[#edf1eb]">
            {riskOverviewKPIs.activeEventsExposureCount}
          </div>
          <span className="text-[9px] text-[#606a70]">External catalysts mapped</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-4 text-left">
          <span className="text-[9px] font-semibold tracking-[.12em] text-[#6b767b]">BUSINESS UNITS</span>
          <div className="mono mt-1 text-[24px] font-semibold text-[#edf1eb]">
            {businessUnitsList.length}
          </div>
          <span className="text-[9px] text-[#606a70]">Operating lines</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-4 text-left">
          <span className="text-[9px] font-semibold tracking-[.12em] text-[#6b767b]">HIGH EXPOSURE UNITS</span>
          <div className="mono mt-1 text-[24px] font-semibold text-[#ff6b6b]">
            {riskOverviewKPIs.highImpactCount}
          </div>
          <span className="text-[9px] text-[#606a70]">&gt; $15M modeled</span>
        </div>
      </section>

      {/* Section 27: Positive and Negative Directional Asymmetry */}
      <section className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 text-[11px]">
        <div className="border-b border-[#1f2427] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            DIRECTIONAL DIVERSITY
          </span>
          <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
            Directional Exposure Asymmetry Across Business Units
          </h2>
          <p className="mt-1 text-[12px] text-[#8e989d]">
            Exogen does not collapse enterprise risk into a single misleading number. Different divisions experience opposing impacts under identical macroeconomic shifts:
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded border border-[#442323] bg-[#161010] p-3.5">
            <span className="mono text-[9px] font-semibold text-[#ff6b6b]">POTENTIAL DOWNSIDE (NEGATIVE)</span>
            <div className="mt-1 text-[13px] font-medium text-[#edf1ec]">Commercial Banking & Payments</div>
            <div className="mono mt-1 text-[16px] font-semibold text-[#ff6b6b]">-$11.0M</div>
            <p className="mt-2 text-[10px] text-[#b8a4a4] leading-relaxed">
              Floating-rate commercial syndications reprice lower; sticky deposit beta compresses margin revenue.
            </p>
          </div>

          <div className="rounded border border-[#483d26] bg-[#1a1710] p-3.5">
            <span className="mono text-[9px] font-semibold text-[#f5c76c]">BALANCED SENSITIVITY (MIXED)</span>
            <div className="mt-1 text-[13px] font-medium text-[#edf1ec]">Markets & Asset Management</div>
            <div className="mono mt-1 text-[16px] font-semibold text-[#f5c76c]">±$8.8M</div>
            <p className="mt-2 text-[10px] text-[#c7beaa] leading-relaxed">
              Bond inventory mark-to-market appreciation and underwriting fees balance derivatives spread volatility.
            </p>
          </div>

          <div className="rounded border border-[#2d412b] bg-[#121a11] p-3.5">
            <span className="mono text-[9px] font-semibold text-[#b8f34a]">BENEFICIARY CONTEXT (POSITIVE)</span>
            <div className="mt-1 text-[13px] font-medium text-[#edf1ec]">Consumer Banking (CCB)</div>
            <div className="mono mt-1 text-[16px] font-semibold text-[#b8f34a]">+$2.8M</div>
            <p className="mt-2 text-[10px] text-[#aebda9] leading-relaxed">
              Lower interest rates stimulate retail mortgage refinancing and strengthen household repayment affordability.
            </p>
          </div>
        </div>
      </section>

      {/* Section 23: Event → Business Unit Matrix */}
      <EventBusinessUnitMatrix
        matrixData={eventBusinessUnitMatrixData}
        onSelectCell={(eventId, unitId) => setLocation(`/exposure/business-unit/${unitId}`)}
      />

      {/* Section 20 & 21: Business Units Cards Grid with Division Filter */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2427] pb-4">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              OPERATING ENTITIES
            </span>
            <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
              JPMorgan Chase Business Units
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            {divisions.map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setSelectedDivision(div)}
                className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  selectedDivision === div
                    ? 'bg-[#1b221a] text-[#b8f34a]'
                    : 'text-[#828c91] hover:text-[#edf0ec]'
                }`}
              >
                {div === 'ALL' ? 'All Divisions' : div}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map((u) => (
            <div
              key={u.id}
              onClick={() => setLocation(`/exposure/business-unit/${u.id}`)}
              className="group flex flex-col justify-between rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px] cursor-pointer transition-all hover:border-[#38434a] hover:bg-[#13171a]"
            >
              <div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-semibold text-[#8ca3b8]">{u.division}</span>
                  <span className="mono text-[#6d777d]">{u.activeRiskEventsCount} risks</span>
                </div>
                <h3 className="mt-2 text-[14px] font-medium text-[#edf0eb] group-hover:text-[#b8f34a] transition-colors">
                  {u.name}
                </h3>
                <p className="mt-1.5 text-[10px] text-[#869298] line-clamp-2 leading-relaxed">
                  {u.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] border-t border-[#1d2225] pt-3">
                  <div>
                    <span className="text-[#6c777d]">Base Exposure:</span>
                    <div className="mono font-semibold text-[#b8f34a] text-[14px]">
                      ${u.modeledExposureUsdM.toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <span className="text-[#6c777d]">Stress Range:</span>
                    <div className="mono text-[#d4ded3]">
                      ${u.exposureRange.lowUsdM.toFixed(1)}M – ${u.exposureRange.highUsdM.toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#1d2225] pt-2.5 text-[10px] text-[#6d777d]">
                <span>Avg Confidence: <strong className="mono text-[#d6ded5]">{u.avgConfidencePct.toFixed(0)}%</strong></span>
                <span className="text-[#b8f34a] group-hover:translate-x-1 transition-transform">Inspect unit →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 29 & 30: Company -> Risk -> Event Reverse View */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5 sm:p-6 text-[11px]">
        <div className="border-b border-[#1f2427] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            REVERSE NAVIGATOR
          </span>
          <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
            Company → Risk → Canonical Event Traversal
          </h2>
          <p className="mt-1 text-[12px] text-[#8e989d]">
            Executives can navigate inward from the enterprise balance sheet back to individual market signals.
          </p>
        </div>

        <div className="mt-4 space-y-2.5 font-mono text-[11px]">
          <div className="flex flex-wrap items-center gap-2 rounded bg-[#0c0f11] p-3 text-[#d3dad1]">
            <span className="font-semibold text-[#b8f34a]">JPMorgan Chase</span>
            <span className="text-[#596469]">→</span>
            <span>Commercial Banking</span>
            <span className="text-[#596469]">→</span>
            <span className="text-[#f5c76c]">Interest Rate Risk</span>
            <span className="text-[#596469]">→</span>
            <span>Fed rate cut ≥50bps</span>
            <span className="text-[#596469]">→</span>
            <span className="text-[#b8f34a]">$6.8M modeled exposure (82% conf)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded bg-[#0c0f11] p-3 text-[#d3dad1]">
            <span className="font-semibold text-[#b8f34a]">JPMorgan Chase</span>
            <span className="text-[#596469]">→</span>
            <span>Markets Division</span>
            <span className="text-[#596469]">→</span>
            <span className="text-[#ff6b6b]">Regulatory Risk</span>
            <span className="text-[#596469]">→</span>
            <span>Basel III Endgame finalized</span>
            <span className="text-[#596469]">→</span>
            <span className="text-[#ff6b6b]">$8.1M modeled capital drag (88% conf)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
