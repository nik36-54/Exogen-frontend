import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowRight,
  Briefcase,
  Building2,
  ChevronRight,
  Eye,
  Filter,
  GitBranch,
  Layers,
  Network,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import {
  businessUnitsList,
  riskOverviewKPIs,
  riskRelationshipsList,
  riskSignalsList,
} from '@/data/risk-intelligence-data';
import { SignatureRiskChain } from '@/components/risk/SignatureRiskChain';
import { CumulativeConfidenceChain } from '@/components/risk/CumulativeConfidenceChain';

type ViewMode = 'EXECUTIVE' | 'ANALYST';

export default function RiskOverviewPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('EXECUTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRisks = riskSignalsList.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-[#b8f34a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
              RISK INTELLIGENCE LAYER
            </span>
          </div>
          <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
            Risk Intelligence
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
            Translate external events into company-specific risk relationships and exposure.
          </p>
        </div>

        {/* Executive vs Analyst View Toggle (Section 53) */}
        <div className="flex items-center rounded border border-[#2b3337] bg-[#121618] p-1 text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode('EXECUTIVE')}
            className={`rounded px-3 py-1 transition-colors ${
              viewMode === 'EXECUTIVE'
                ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                : 'text-[#828c91] hover:text-[#edf0ec]'
            }`}
          >
            Executive View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('ANALYST')}
            className={`rounded px-3 py-1 transition-colors ${
              viewMode === 'ANALYST'
                ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                : 'text-[#828c91] hover:text-[#edf0ec]'
            }`}
          >
            Analyst Deep Dive
          </button>
        </div>
      </div>

      {/* Top KPI Cards (Section 3) */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">ACTIVE RISKS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {riskOverviewKPIs.activeRisksCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Firm perimeter</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">HIGH IMPACT</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#ff6b6b]">
            {riskOverviewKPIs.highImpactCount}
          </div>
          <span className="text-[8px] text-[#606a70]">High severity</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">AFFECTED UNITS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {riskOverviewKPIs.businessUnitsAffectedCount}
          </div>
          <span className="text-[8px] text-[#606a70]">JPMorgan entities</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">EVENTS MAPPED</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {riskOverviewKPIs.externalEventsMappedCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Canonical links</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">DIRECT RISKS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {riskOverviewKPIs.directRisksCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Direct mechanisms</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">INDIRECT RISKS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#8ca3b8]">
            {riskOverviewKPIs.indirectRisksCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Intermediate channels</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">MIXED IMPACT</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {riskOverviewKPIs.mixedImpactCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Opposing unit vector</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">LOW CONFIDENCE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#ff6b6b]">
            {riskOverviewKPIs.lowConfidenceCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Flagged for review</span>
        </div>
      </section>

      {/* Sub-Navigation Bar (Section 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-3" role="tablist">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className="rounded bg-[#1b221a] px-3 py-1.5 text-[11px] font-medium text-[#b8f34a]"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setLocation('/risk/taxonomy')}
            className="rounded px-3 py-1.5 text-[11px] font-medium text-[#848e93] hover:text-[#e4e8e4]"
          >
            Taxonomy
          </button>
          <button
            type="button"
            onClick={() => setLocation('/risk/relationships')}
            className="rounded px-3 py-1.5 text-[11px] font-medium text-[#848e93] hover:text-[#e4e8e4]"
          >
            Relationships ({riskRelationshipsList.length})
          </button>
          <button
            type="button"
            onClick={() => setLocation('/risk/transmission')}
            className="rounded px-3 py-1.5 text-[11px] font-medium text-[#848e93] hover:text-[#e4e8e4]"
          >
            Transmission Graph
          </button>
          <button
            type="button"
            onClick={() => setLocation('/exposure')}
            className="rounded px-3 py-1.5 text-[11px] font-medium text-[#848e93] hover:text-[#e4e8e4]"
          >
            Company Exposure ($142.6M)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLocation('/risk-graph')}
          className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
        >
          <Network size={13} />
          <span>Open Full Interactive Risk Graph →</span>
        </button>
      </div>

      {/* Section 4: Signature Risk Chain */}
      <SignatureRiskChain />

      {/* Cumulative Confidence Chain (Section 47) */}
      <CumulativeConfidenceChain
        chain={{
          eventIdentityConfidencePct: 94.2,
          riskMappingConfidencePct: 87.0,
          transmissionConfidencePct: 82.0,
          exposureConfidencePct: 78.0,
        }}
      />

      {/* Active Risks Table */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2427] pb-4">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              RISK PORTFOLIO
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Active Company Risk Signals
            </h2>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#687278]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search risk taxonomy & events..."
              className="w-full rounded border border-[#262c30] bg-[#0c0f11] py-1.5 pl-8 pr-3 text-[11px] text-[#edf0ec] placeholder-[#606a70] outline-none focus:border-[#424e54]"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                <th className="py-2.5 pl-3">RISK SIGNAL</th>
                <th className="py-2.5">TAXONOMY PARENT</th>
                <th className="py-2.5 text-right">ACTIVE EVENTS</th>
                <th className="py-2.5 text-right">AFFECTED UNITS</th>
                <th className="py-2.5 text-right">MODELED EXPOSURE</th>
                <th className="py-2.5 text-right">CONFIDENCE</th>
                <th className="py-2.5 pr-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2023]">
              {filteredRisks.map((risk) => (
                <tr
                  key={risk.id}
                  onClick={() => setLocation(`/risk/${risk.id}`)}
                  className="group cursor-pointer transition-colors hover:bg-[#15191c]"
                >
                  <td className="py-3 pl-3">
                    <div className="font-medium text-[#edf1eb] group-hover:text-[#b8f34a] transition-colors">
                      {risk.name}
                    </div>
                    <div className="mt-0.5 text-[9px] text-[#717b81]">{risk.description}</div>
                  </td>
                  <td className="py-3 text-[#9ba5aa] whitespace-nowrap">{risk.category}</td>
                  <td className="mono py-3 text-right text-[#d6ddd6]">
                    {risk.activeEventsCount}
                  </td>
                  <td className="mono py-3 text-right text-[#d6ddd6]">
                    {risk.affectedBusinessUnitsCount}
                  </td>
                  <td className="mono py-3 text-right font-medium text-[#b8f34a]">
                    ${risk.totalModeledExposureUsdM.toFixed(1)}M
                  </td>
                  <td className="mono py-3 text-right text-[#edf1eb]">
                    {risk.confidencePct.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-3 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[10px] text-[#869298] hover:text-[#b8f34a]"
                    >
                      <span>Inspect</span>
                      <ChevronRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
