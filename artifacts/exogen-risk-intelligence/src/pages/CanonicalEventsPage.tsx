import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { canonicalEventsKPIs, canonicalEventsList } from '@/data/canonical-matching-data';
import { SignaturePipelineVisualizer } from '@/components/canonical/SignaturePipelineVisualizer';

type FilterTab = 'ALL' | 'RECENT' | 'HIGH' | 'LOW' | 'REVIEW';

export default function CanonicalEventsPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return canonicalEventsList.filter((event) => {
      // Sub-nav tab filter
      if (activeTab === 'HIGH' && event.identityConfidencePct < 90) return false;
      if (activeTab === 'LOW' && (event.status !== 'LOW_CONFIDENCE' && event.identityConfidencePct >= 70)) return false;
      if (activeTab === 'REVIEW' && event.status !== 'REVIEW') return false;
      if (activeTab === 'RECENT' && !event.createdAt.includes('09-30')) return false;

      // Text query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.id.toLowerCase().includes(q) ||
        event.category.toLowerCase().includes(q) ||
        event.subject.toLowerCase().includes(q)
      );
    });
  }, [activeTab, searchQuery]);

  const getStatusBadge = (status: string, confidence: number) => {
    if (status === 'CANONICAL') {
      return (
        <span className="mono text-[10px] font-semibold text-[#b8f34a]">
          CANONICAL
        </span>
      );
    }
    if (status === 'REVIEW') {
      return (
        <span className="mono text-[10px] font-semibold text-[#f5c76c]">
          REVIEW
        </span>
      );
    }
    return (
      <span className="mono text-[10px] font-semibold text-[#ff6b6b]">
        LOW CONF
      </span>
    );
  };

  return (
    <div className="space-y-7">
      {/* Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            EVENT RESOLUTION LAYER
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Canonical Events
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Normalized real-world events derived from contracts across external prediction venues.
        </p>
      </div>

      {/* KPI Cards (Section 3) */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">CANONICAL EVENTS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {canonicalEventsKPIs.canonicalEventsCount.toLocaleString()}
          </div>
          <span className="text-[8px] text-[#606a70]">Active definitions</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">HIGH CONFIDENCE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {canonicalEventsKPIs.highConfidenceCount.toLocaleString()}
          </div>
          <span className="text-[8px] text-[#606a70]">≥ 90% score</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">NEEDS REVIEW</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {canonicalEventsKPIs.needsReviewCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Queue pending</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">LOW CONFIDENCE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#ff6b6b]">
            {canonicalEventsKPIs.lowConfidenceCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Semantic dispute</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">MATCH RATE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {canonicalEventsKPIs.matchRatePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Auto consolidation</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">AVG CONFIDENCE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {canonicalEventsKPIs.avgIdentityConfidencePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Model weighted</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">CONTRACTS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {canonicalEventsKPIs.contractsProcessedCount.toLocaleString()}
          </div>
          <span className="text-[8px] text-[#606a70]">Raw ingested</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">STALE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {canonicalEventsKPIs.staleContractsCount}
          </div>
          <span className="text-[8px] text-[#606a70]">&gt; 60m old</span>
        </div>
      </section>

      {/* Signature Pipeline Visualizer (Section 41) */}
      <SignaturePipelineVisualizer />

      {/* Section 4: Canonical Event Table with Sub-navigation */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2427] pb-4">
          {/* Contextual Sub-navigation (Section 2) */}
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-[#1b221a] text-[#b8f34a]'
                  : 'text-[#848e93] hover:text-[#e4e8e4]'
              }`}
            >
              All Events (1,284)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('RECENT')}
              className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === 'RECENT'
                  ? 'bg-[#1b221a] text-[#b8f34a]'
                  : 'text-[#848e93] hover:text-[#e4e8e4]'
              }`}
            >
              Recently Created
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('HIGH')}
              className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === 'HIGH'
                  ? 'bg-[#1b221a] text-[#b8f34a]'
                  : 'text-[#848e93] hover:text-[#e4e8e4]'
              }`}
            >
              High Confidence (1,047)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LOW')}
              className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === 'LOW'
                  ? 'bg-[#1b221a] text-[#b8f34a]'
                  : 'text-[#848e93] hover:text-[#e4e8e4]'
              }`}
            >
              Low Confidence (154)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('REVIEW')}
              className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeTab === 'REVIEW'
                  ? 'bg-[#1b221a] text-[#b8f34a]'
                  : 'text-[#848e93] hover:text-[#e4e8e4]'
              }`}
            >
              Needs Review (83)
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#687278]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter canonical events..."
              className="w-full rounded border border-[#262c30] bg-[#0c0f11] py-1.5 pl-8 pr-3 text-[11px] text-[#edf0ec] placeholder-[#606a70] outline-none focus:border-[#424e54]"
            />
          </div>
        </div>

        {/* Dense Institutional Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                <th className="py-2.5 pl-3">CANONICAL EVENT</th>
                <th className="py-2.5">CATEGORY</th>
                <th className="py-2.5 text-right">CONTRACTS</th>
                <th className="py-2.5 text-right">VENUES</th>
                <th className="py-2.5 text-right">CONFIDENCE</th>
                <th className="py-2.5 text-right">CONSENSUS</th>
                <th className="py-2.5 text-right">FRESHNESS</th>
                <th className="py-2.5 pr-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2023]">
              {filteredEvents.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setLocation(`/events/${evt.id}`)}
                  className="group cursor-pointer transition-colors hover:bg-[#15191c]"
                >
                  <td className="max-w-[420px] py-3 pl-3">
                    <div className="font-medium text-[#edf1eb] group-hover:text-[#b8f34a] transition-colors">
                      {evt.title}
                    </div>
                    <div className="mono mt-0.5 text-[9px] text-[#6c777d]">
                      {evt.id} · {evt.subject}
                    </div>
                  </td>
                  <td className="py-3 text-[#9ba5aa]">{evt.category}</td>
                  <td className="mono py-3 text-right text-[#d6ddd6]">
                    {evt.contractsCount}
                  </td>
                  <td className="mono py-3 text-right text-[#d6ddd6]">
                    {evt.venuesCount}
                  </td>
                  <td className="mono py-3 text-right font-medium text-[#b8f34a]">
                    {evt.identityConfidencePct.toFixed(1)}%
                  </td>
                  <td className="mono py-3 text-right text-[#edf1eb]">
                    {evt.consensusProbabilityPct.toFixed(1)}%
                  </td>
                  <td className="mono py-3 text-right text-[#889398]">
                    {evt.freshness}
                  </td>
                  <td className="py-3 pr-3 text-right">
                    {getStatusBadge(evt.status, evt.identityConfidencePct)}
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#788287]">
                    No canonical events match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
