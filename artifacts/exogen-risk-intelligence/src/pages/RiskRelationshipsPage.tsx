import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  GitBranch,
  Layers,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { riskRelationshipsList } from '@/data/risk-intelligence-data';
import type { ImpactDirection, RelationshipType, RiskRelationshipItem } from '@/types/risk-intelligence';

export default function RiskRelationshipsPage() {
  const [, setLocation] = useLocation();
  const [selectedRelId, setSelectedRelId] = useState<string>(riskRelationshipsList[0]?.id || 'REL-FED-01');
  const [filterRelType, setFilterRelType] = useState<string>('ALL');

  const selectedRel = riskRelationshipsList.find((r) => r.id === selectedRelId) || riskRelationshipsList[0];

  const filteredRelationships = riskRelationshipsList.filter((r) => {
    if (filterRelType === 'ALL') return true;
    return r.relationship === filterRelType;
  });

  const getDirectionBadge = (direction: ImpactDirection) => {
    switch (direction) {
      case 'NEGATIVE':
        return <span className="mono text-[10px] font-semibold text-[#ff6b6b]">NEGATIVE</span>;
      case 'POSITIVE':
        return <span className="mono text-[10px] font-semibold text-[#b8f34a]">POSITIVE</span>;
      case 'MIXED':
        return <span className="mono text-[10px] font-semibold text-[#f5c76c]">MIXED</span>;
      default:
        return <span className="mono text-[10px] font-semibold text-[#8e989d]">UNCERTAIN</span>;
    }
  };

  const getRelBadge = (rel: RelationshipType) => {
    switch (rel) {
      case 'DIRECT':
        return <span className="mono text-[10px] font-semibold text-[#b8f34a]">DIRECT</span>;
      case 'INDIRECT':
        return <span className="mono text-[10px] font-semibold text-[#8ca3b8]">INDIRECT</span>;
      case 'CONDITIONAL':
        return <span className="mono text-[10px] font-semibold text-[#f5c76c]">CONDITIONAL</span>;
      default:
        return <span className="mono text-[10px] font-semibold text-[#b6c0c5]">MIXED</span>;
    }
  };

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
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            RELATIONSHIP GRAPH
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Risk Relationships
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Deterministic and probabilistic causal linkages connecting canonical events to firm risk taxonomy classes.
        </p>
      </div>

      {/* Section 8: Table & Section 11: Relationship Detail Side-by-Side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: Relationships Table */}
        <div className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterRelType('ALL')}
                className={`rounded px-2.5 py-1 text-[10px] ${
                  filterRelType === 'ALL' ? 'bg-[#1b221a] text-[#b8f34a] font-semibold' : 'text-[#848e93]'
                }`}
              >
                All ({riskRelationshipsList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterRelType('DIRECT')}
                className={`rounded px-2.5 py-1 text-[10px] ${
                  filterRelType === 'DIRECT' ? 'bg-[#1b221a] text-[#b8f34a] font-semibold' : 'text-[#848e93]'
                }`}
              >
                Direct
              </button>
              <button
                type="button"
                onClick={() => setFilterRelType('INDIRECT')}
                className={`rounded px-2.5 py-1 text-[10px] ${
                  filterRelType === 'INDIRECT' ? 'bg-[#1b221a] text-[#b8f34a] font-semibold' : 'text-[#848e93]'
                }`}
              >
                Indirect
              </button>
            </div>

            <span className="text-[10px] text-[#6b767c]">Select row to inspect causality</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                  <th className="py-2 pl-2">CANONICAL EVENT</th>
                  <th className="py-2">RISK CLASS</th>
                  <th className="py-2">TYPE</th>
                  <th className="py-2 text-right">EXPOSURE</th>
                  <th className="py-2 pr-2 text-right">CONF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2023]">
                {filteredRelationships.map((r) => {
                  const isSelected = selectedRelId === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRelId(r.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#181e19]' : 'hover:bg-[#14181a]'
                      }`}
                    >
                      <td className="max-w-[200px] py-3 pl-2">
                        <div className="font-medium text-[#edf0eb] truncate">{r.eventTitle}</div>
                        <div className="mono text-[8px] text-[#6b767b]">{r.canonicalEventId}</div>
                      </td>
                      <td className="py-3 text-[#9ba5aa] whitespace-nowrap">{r.riskName}</td>
                      <td className="py-3">{getRelBadge(r.relationship)}</td>
                      <td className="mono py-3 text-right font-medium text-[#b8f34a]">
                        ${r.modeledExposureUsdM.toFixed(1)}M
                      </td>
                      <td className="mono py-3 pr-2 text-right text-[#d4ded3]">
                        {r.confidencePct.toFixed(0)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Relationship Deep Dive (Section 11 & 12) */}
        {selectedRel && (
          <div className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                  RELATIONSHIP SPECIFICATION
                </span>
                <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
                  Event → Risk Relationship
                </h2>
              </div>
              <span className="mono text-[10px] text-[#717b81]">{selectedRel.id}</span>
            </div>

            {/* Stepped summary */}
            <div className="mt-4 rounded border border-[#21272b] bg-[#0c0f11] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[#6d777d]">Trigger Event:</span>
                <span className="font-medium text-[#edf1eb] text-right truncate max-w-[220px]">
                  {selectedRel.eventTitle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d777d]">Mapped Risk:</span>
                <span className="font-medium text-[#b8f34a]">{selectedRel.riskName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d777d]">Relationship Type:</span>
                <span>{getRelBadge(selectedRel.relationship)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d777d]">Impact Direction:</span>
                <span>{getDirectionBadge(selectedRel.direction)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d777d]">Relationship Confidence:</span>
                <span className="mono font-semibold text-[#b8f34a]">{selectedRel.confidencePct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#1a1f22] pt-2">
                <span className="text-[#6d777d]">Modeled Exposure:</span>
                <span className="mono text-[14px] font-semibold text-[#b8f34a]">
                  ${selectedRel.modeledExposureUsdM.toFixed(1)}M
                </span>
              </div>
            </div>

            {/* Section 12: Why does this event create this risk? */}
            <div className="mt-5">
              <span className="text-[9px] font-semibold tracking-[.12em] text-[#6e787d]">
                WHY DOES THIS EVENT CREATE THIS RISK?
              </span>
              <div className="mt-2 space-y-2">
                <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-2.5">
                  <span className="mono text-[8px] text-[#636d72]">01. EVENT TRIGGER</span>
                  <div className="mt-0.5 text-[#dbe2dc]">{selectedRel.whyExplanation.eventStep}</div>
                </div>
                <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-2.5">
                  <span className="mono text-[8px] text-[#636d72]">02. MARKET DISLOCATION</span>
                  <div className="mt-0.5 text-[#dbe2dc]">{selectedRel.whyExplanation.rateOrMarketStep}</div>
                </div>
                <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-2.5">
                  <span className="mono text-[8px] text-[#636d72]">03. FINANCIAL MECHANISM</span>
                  <div className="mt-0.5 text-[#dbe2dc]">{selectedRel.whyExplanation.financialMechanismStep}</div>
                </div>
                <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-2.5">
                  <span className="mono text-[8px] text-[#636d72]">04. BUSINESS EFFECT</span>
                  <div className="mt-0.5 text-[#dbe2dc]">{selectedRel.whyExplanation.businessEffectStep}</div>
                </div>
              </div>
            </div>

            {/* Explanation & Model Basis */}
            <div className="mt-4 rounded border border-[#21272b] bg-[#0d1012] p-3 text-[10px] text-[#8e989d]">
              <span className="font-semibold text-[#d4ded3]">Model Basis:</span> {selectedRel.modelBasis}. {selectedRel.explanation}
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-[#1f2427] pt-3">
              <button
                type="button"
                onClick={() => setLocation(`/events/${selectedRel.canonicalEventId}`)}
                className="text-[10px] text-[#8ca3b8] hover:text-[#edf0ec]"
              >
                View source canonical event →
              </button>
              <button
                type="button"
                onClick={() => setLocation(`/risk/${selectedRel.riskId}`)}
                className="flex items-center gap-1 rounded bg-[#171c1f] px-3 py-1.5 text-[10px] font-semibold text-[#b8f34a] hover:bg-[#20272b]"
              >
                <span>Inspect Risk Signal</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
