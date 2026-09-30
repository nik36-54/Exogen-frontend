import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { riskTaxonomyData } from '@/data/risk-intelligence-data';

export default function RiskTaxonomyPage() {
  const [, setLocation] = useLocation();
  const [selectedSubtypeId, setSelectedSubtypeId] = useState<string>('interest-rate-risk');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-market-risk': true,
    'cat-credit-risk': true,
    'cat-regulatory-risk': true,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Find selected subtype across all categories
  const selectedSubtype = riskTaxonomyData
    .flatMap((c) => c.subtypes)
    .find((s) => s.id === selectedSubtypeId);

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

      {/* Header (Section 6) */}
      <div>
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            TAXONOMY ARCHITECTURE
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Risk Taxonomy
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          A structured framework for translating external events into business-relevant risk categories.
        </p>
      </div>

      {/* Layout: Expandable Hierarchy on Left, Subtype Detail Inspector on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: Hierarchical Taxonomy Tree */}
        <div className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5">
          <div className="flex items-center justify-between border-b border-[#1f2427] pb-3 text-[11px]">
            <span className="font-semibold text-[#8ca3b8] uppercase tracking-[.1em] text-[9px]">
              TAXONOMY CLASSIFICATION TREE
            </span>
            <span className="text-[#6c777d]">7 Primary Classes · 22 Risk Subtypes</span>
          </div>

          <div className="mt-4 space-y-2">
            {riskTaxonomyData.map((cat) => {
              const isExpanded = !!expandedCategories[cat.id];
              return (
                <div key={cat.id} className="rounded border border-[#1f2427] bg-[#0c0f11] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className="flex w-full items-center justify-between p-3 text-left hover:bg-[#13171a] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={14}
                        className={`text-[#727d82] transition-transform ${isExpanded ? 'rotate-90 text-[#b8f34a]' : ''}`}
                      />
                      <span className="text-[12px] font-semibold text-[#edf1ec] uppercase tracking-[.06em]">
                        {cat.name}
                      </span>
                    </div>
                    <span className="mono text-[10px] text-[#6d777d]">
                      {cat.subtypes.length} subtypes
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#1a1f22] bg-[#0a0d0e] p-2 space-y-1">
                      {cat.subtypes.map((sub) => {
                        const isSelected = selectedSubtypeId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setSelectedSubtypeId(sub.id)}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-[11px] transition-colors ${
                              isSelected
                                ? 'bg-[#182116] text-[#b8f34a] font-medium'
                                : 'text-[#8e989d] hover:bg-[#131618] hover:text-[#dce1dc]'
                            }`}
                          >
                            <span>{sub.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="mono text-[10px] text-[#69747a]">
                                ${sub.activeExposureUsdM.toFixed(1)}M
                              </span>
                              <ChevronRight size={11} className="text-[#555f64]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Subtype Detail (Section 7) */}
        {selectedSubtype && (
          <div className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                  TAXONOMY SUBTYPE DETAIL
                </span>
                <h2 className="mt-1 text-[18px] font-medium text-[#edf0eb]">
                  {selectedSubtype.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLocation(`/risk/${selectedSubtype.id}`)}
                className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
              >
                <span>View Risk Signal →</span>
              </button>
            </div>

            <p className="mt-3 text-[12px] leading-relaxed text-[#939da2]">
              {selectedSubtype.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
                <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
                  PARENT CATEGORY
                </span>
                <div className="mt-1 font-semibold text-[#edf1eb]">
                  {selectedSubtype.parentCategory}
                </div>
              </div>

              <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
                <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
                  RELATED EVENTS
                </span>
                <div className="mono mt-1 font-semibold text-[#edf1eb]">
                  {selectedSubtype.activeEventsCount}
                </div>
              </div>

              <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
                <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
                  AFFECTED BUSINESS UNITS
                </span>
                <div className="mono mt-1 font-semibold text-[#edf1eb]">
                  {selectedSubtype.affectedBusinessUnitsCount}
                </div>
              </div>

              <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
                <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
                  ACTIVE EXPOSURE
                </span>
                <div className="mono mt-1 font-semibold text-[#b8f34a]">
                  ${selectedSubtype.activeExposureUsdM.toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Related External Events List */}
            <div className="mt-6">
              <span className="text-[9px] font-semibold tracking-[.12em] text-[#6e787d]">
                SAMPLE LINKED EXTERNAL EVENTS
              </span>
              <div className="mt-2.5 space-y-2">
                {selectedSubtype.relatedEventIds.map((eventId) => (
                  <button
                    key={eventId}
                    type="button"
                    onClick={() => setLocation(`/events/${eventId}`)}
                    className="flex w-full items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] p-2.5 text-left text-[11px] hover:border-[#38434a] hover:bg-[#13171a] transition-colors"
                  >
                    <div>
                      <span className="mono text-[9px] text-[#6d777d]">{eventId}</span>
                      <div className="font-medium text-[#edf0ec]">
                        {eventId === 'CE-000184'
                          ? 'Fed cuts rates ≥50bps before Mar 2027'
                          : eventId === 'CE-000219'
                          ? 'Brent crude exceeds $120 before Dec 2026'
                          : eventId === 'CE-000402'
                          ? 'Major banking regulation passes before Q2 2027'
                          : eventId === 'CE-000612'
                          ? 'ECB lowers deposit facility rate ≥50bps'
                          : eventId === 'CE-000789'
                          ? 'Taiwan Strait maritime shipping war risk surcharge'
                          : 'Major credit rating agency downgrades U.S. sovereign debt'}
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-[#848f95]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
