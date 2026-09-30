import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Filter,
  GitBranch,
  Layers,
  Scale,
  Search,
  Sliders,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { matchCandidatePairs, matchingKPIs } from '@/data/canonical-matching-data';
import type { MatchCandidatePair, MatchDecisionType } from '@/types/canonical-matching';
import { SideBySideMatchViewer } from '@/components/matching/SideBySideMatchViewer';
import { MergeConfirmModal } from '@/components/matching/MergeConfirmModal';
import { ThresholdConfigDrawer } from '@/components/matching/ThresholdConfigDrawer';

type NavTab = 'QUEUE' | 'ANALYSIS' | 'DECISIONS';
type SortFilter = 'UNCERTAINTY' | 'IMPACT' | 'FRESHNESS' | 'CREATED';

export default function MatchingPage() {
  const [activeTab, setActiveTab] = useState<NavTab>('QUEUE');
  const [pairs, setPairs] = useState<MatchCandidatePair[]>(matchCandidatePairs);
  const [selectedPairId, setSelectedPairId] = useState<string>(pairs[0]?.id ?? 'PAIR-FED-01');
  const [sortBy, setSortBy] = useState<SortFilter>('UNCERTAINTY');
  const [searchQuery, setSearchQuery] = useState('');
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [thresholdDrawerOpen, setThresholdDrawerOpen] = useState(false);
  const [autoMergeThreshold, setAutoMergeThreshold] = useState(0.90);
  const [reviewThreshold, setReviewThreshold] = useState(0.65);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedPair = pairs.find((p) => p.id === selectedPairId) || pairs[0];

  const filteredAndSortedPairs = useMemo(() => {
    let result = pairs.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.eventATitle.toLowerCase().includes(q) ||
        p.eventBTitle.toLowerCase().includes(q) ||
        p.semanticDifference.toLowerCase().includes(q) ||
        p.venueA.toLowerCase().includes(q) ||
        p.venueB.toLowerCase().includes(q)
      );
    });

    if (sortBy === 'UNCERTAINTY') {
      result.sort((a, b) => b.uncertaintyScorePct - a.uncertaintyScorePct);
    } else if (sortBy === 'IMPACT') {
      result.sort((a, b) => b.potentialDownsideImpactUsdM - a.potentialDownsideImpactUsdM);
    } else if (sortBy === 'FRESHNESS') {
      result.sort((a, b) => parseInt(a.freshness) - parseInt(b.freshness));
    }
    return result;
  }, [pairs, searchQuery, sortBy]);

  const handleDecisionChange = (pairId: string, newDecision: MatchDecisionType) => {
    setPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, status: newDecision } : p))
    );
    showToast(`Pair ${pairId} status updated to ${newDecision}`);
  };

  const handleMergeConfirm = () => {
    if (selectedPair) {
      handleDecisionChange(selectedPair.id, 'MERGE');
      showToast(`Events successfully consolidated into canonical event.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getStatusBadge = (status: MatchDecisionType) => {
    if (status === 'MERGE') {
      return <span className="mono text-[10px] font-semibold text-[#b8f34a]">AUTO-MERGE</span>;
    }
    if (status === 'DISTINCT') {
      return <span className="mono text-[10px] font-semibold text-[#8e989d]">DISTINCT</span>;
    }
    return <span className="mono text-[10px] font-semibold text-[#f5c76c]">REVIEW</span>;
  };

  return (
    <div className="space-y-7">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[6px] border border-[#3b4b2f] bg-[#162014] px-4 py-2.5 text-[11px] text-[#b8f34a] shadow-lg animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Title & Subtitle (Section 10) */}
      <div>
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            IDENTITY RESOLUTION WORKSPACE
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Event Matching
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Resolve whether contracts across venues represent the same underlying event.
        </p>
      </div>

      {/* Top KPIs (Section 10) */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">CANDIDATES</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {matchingKPIs.matchCandidatesCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Active pairs</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">AUTO-MERGED</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {matchingKPIs.autoMergedCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Consolidated</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">DISTINCT</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#8e989d]">
            {matchingKPIs.distinctCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Kept separate</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">NEEDS REVIEW</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {matchingKPIs.needsReviewCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Analyst queue</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">AUTO-MATCH RATE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {matchingKPIs.autoMatchRatePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Autonomous flow</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">AVG MATCH SCORE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {matchingKPIs.avgMatchScorePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Confidence score</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">REVIEW RATE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {matchingKPIs.reviewRatePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Human-in-the-loop</span>
        </div>
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
        <div className="flex items-center gap-1.5" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
              activeTab === 'QUEUE'
                ? 'bg-[#1b221a] text-[#b8f34a]'
                : 'text-[#848e93] hover:text-[#e4e8e4]'
            }`}
          >
            Review Queue ({pairs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ANALYSIS')}
            className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
              activeTab === 'ANALYSIS'
                ? 'bg-[#1b221a] text-[#b8f34a]'
                : 'text-[#848e93] hover:text-[#e4e8e4]'
            }`}
          >
            Match Analysis ({selectedPair?.id})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DECISIONS')}
            className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
              activeTab === 'DECISIONS'
                ? 'bg-[#1b221a] text-[#b8f34a]'
                : 'text-[#848e93] hover:text-[#e4e8e4]'
            }`}
          >
            Decisions Log
          </button>
        </div>

        <button
          type="button"
          onClick={() => setThresholdDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1 text-[10px] text-[#919b9f] hover:border-[#3e494f] hover:text-[#edf0ec]"
        >
          <Sliders size={12} />
          <span>Threshold calibration (≥ {autoMergeThreshold.toFixed(2)})</span>
        </button>
      </div>

      {/* TAB 1: REVIEW QUEUE (Section 11 & Section 44) */}
      {activeTab === 'QUEUE' && (
        <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2427] pb-4">
            {/* Prioritization sort controls (Section 44) */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#6d777d]">Sort by:</span>
              <button
                type="button"
                onClick={() => setSortBy('UNCERTAINTY')}
                className={`rounded px-2.5 py-1 text-[10px] transition-colors ${
                  sortBy === 'UNCERTAINTY'
                    ? 'bg-[#1c221a] text-[#b8f34a] font-semibold'
                    : 'text-[#838d92] hover:text-[#edf0eb]'
                }`}
              >
                Match uncertainty
              </button>
              <button
                type="button"
                onClick={() => setSortBy('IMPACT')}
                className={`rounded px-2.5 py-1 text-[10px] transition-colors ${
                  sortBy === 'IMPACT'
                    ? 'bg-[#1c221a] text-[#b8f34a] font-semibold'
                    : 'text-[#838d92] hover:text-[#edf0eb]'
                }`}
              >
                Downstream impact
              </button>
              <button
                type="button"
                onClick={() => setSortBy('FRESHNESS')}
                className={`rounded px-2.5 py-1 text-[10px] transition-colors ${
                  sortBy === 'FRESHNESS'
                    ? 'bg-[#1c221a] text-[#b8f34a] font-semibold'
                    : 'text-[#838d92] hover:text-[#edf0eb]'
                }`}
              >
                Freshness
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#687278]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter review queue pairs..."
                className="w-full rounded border border-[#262c30] bg-[#0c0f11] py-1.5 pl-8 pr-3 text-[11px] text-[#edf0ec] placeholder-[#606a70] outline-none focus:border-[#424e54]"
              />
            </div>
          </div>

          {/* Review Queue Table (Section 11) */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                  <th className="py-2.5 pl-3">EVENT A (SOURCE 1)</th>
                  <th className="py-2.5">EVENT B (SOURCE 2)</th>
                  <th className="py-2.5 text-right">MATCH SCORE</th>
                  <th className="py-2.5 text-center">CONFIDENCE</th>
                  <th className="py-2.5">DIFFERENCE</th>
                  <th className="py-2.5">RECOMMENDATION</th>
                  <th className="py-2.5 pr-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2023]">
                {filteredAndSortedPairs.map((p) => {
                  const isSelected = selectedPairId === p.id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setSelectedPairId(p.id);
                        setActiveTab('ANALYSIS');
                      }}
                      className={`group cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#181d19]' : 'hover:bg-[#14181a]'
                      }`}
                    >
                      <td className="max-w-[260px] py-3 pl-3">
                        <div className="font-medium text-[#edf1eb] group-hover:text-[#b8f34a] transition-colors truncate">
                          {p.eventATitle}
                        </div>
                        <div className="mono mt-0.5 text-[9px] text-[#6c777d]">
                          {p.venueA} · {p.eventA.time}
                        </div>
                      </td>
                      <td className="max-w-[260px] py-3">
                        <div className="font-medium text-[#edf1eb] group-hover:text-[#b8f34a] transition-colors truncate">
                          {p.eventBTitle}
                        </div>
                        <div className="mono mt-0.5 text-[9px] text-[#6c777d]">
                          {p.venueB} · {p.eventB.time}
                        </div>
                      </td>
                      <td className="mono py-3 text-right font-medium text-[#edf1eb]">
                        {p.matchScorePct.toFixed(1)}%
                      </td>
                      <td className="py-3 text-center">
                        <span className="mono text-[10px] text-[#9fa9ad]">
                          {p.identityConfidence}
                        </span>
                      </td>
                      <td className="py-3 text-[#f5c76c]">
                        {p.semanticDifference}
                      </td>
                      <td className="py-3">
                        <span className="mono text-[10px] text-[#b3bbb6]">
                          {p.recommendation}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        {getStatusBadge(p.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: SIDE-BY-SIDE MATCH ANALYSIS (Section 12, 13, 14, 15, 17) */}
      {activeTab === 'ANALYSIS' && selectedPair && (
        <SideBySideMatchViewer
          pair={selectedPair}
          onDecisionChange={(newDecision) => handleDecisionChange(selectedPair.id, newDecision)}
          onOpenMergeModal={() => setMergeModalOpen(true)}
          onOpenThresholds={() => setThresholdDrawerOpen(true)}
        />
      )}

      {/* TAB 3: DECISIONS LOG (Section 18 & 36) */}
      {activeTab === 'DECISIONS' && (
        <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
          <div className="border-b border-[#1f2427] pb-3">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              AUDIT LOG & RESOLUTION LEDGER
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Reconciled Match Decisions History
            </h2>
            <p className="mt-1 text-[12px] text-[#869197]">
              Every automated auto-merge, distinct classification, and manual reviewer override is recorded for model lineage.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {pairs.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-4 text-[11px] sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] font-semibold text-[#8ca3b8]">{p.id}</span>
                    <span className="text-[#3b4348]">·</span>
                    <span className="text-[10px] text-[#6d777d]">{p.createdAt}</span>
                    <span className="text-[#3b4348]">·</span>
                    {getStatusBadge(p.status)}
                  </div>
                  <div className="mt-1.5 text-[12px] font-medium text-[#edf0eb]">
                    {p.eventATitle} <span className="text-[#6c777d]">vs</span> {p.eventBTitle}
                  </div>
                  <p className="mt-1 text-[10px] text-[#828e93]">
                    {p.decisionRationale.summary}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-3 sm:mt-0">
                  <div className="text-right">
                    <span className="block text-[8px] text-[#6d777d]">MATCH SCORE</span>
                    <span className="mono text-[13px] font-semibold text-[#b8f34a]">
                      {p.matchScorePct.toFixed(1)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPairId(p.id);
                      setActiveTab('ANALYSIS');
                    }}
                    className="flex items-center gap-1 rounded border border-[#283035] bg-[#14181a] px-2.5 py-1.5 text-[10px] text-[#b6c0c5] hover:border-[#3c4850] hover:text-[#edf0ec]"
                  >
                    <span>Inspect</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmation Modal */}
      {selectedPair && (
        <MergeConfirmModal
          isOpen={mergeModalOpen}
          onClose={() => setMergeModalOpen(false)}
          onConfirm={handleMergeConfirm}
          eventATitle={selectedPair.eventATitle}
          eventBTitle={selectedPair.eventBTitle}
        />
      )}

      {/* Threshold Configuration Drawer */}
      <ThresholdConfigDrawer
        isOpen={thresholdDrawerOpen}
        onClose={() => setThresholdDrawerOpen(false)}
        autoMergeThreshold={autoMergeThreshold}
        reviewThreshold={reviewThreshold}
        onSave={(newAuto, newReview) => {
          setAutoMergeThreshold(newAuto);
          setReviewThreshold(newReview);
          showToast(`Thresholds updated: Auto-merge ≥ ${newAuto.toFixed(2)}, Review ≥ ${newReview.toFixed(2)}`);
        }}
      />
    </div>
  );
}
