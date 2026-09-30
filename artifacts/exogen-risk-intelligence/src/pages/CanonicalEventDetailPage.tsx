import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Fingerprint,
  GitBranch,
  Info,
  Layers,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { canonicalEventsList } from '@/data/canonical-matching-data';
import { EventFingerprintCard } from '@/components/canonical/EventFingerprintCard';
import { RawVsNormalizedCard } from '@/components/canonical/RawVsNormalizedCard';

interface Props {
  eventId: string;
}

export default function CanonicalEventDetailPage({ eventId }: Props) {
  const [, setLocation] = useLocation();
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  // Look up event from dataset, fallback to first event if not found
  const event =
    canonicalEventsList.find((e) => e.id === eventId) ||
    canonicalEventsList[0];

  const hasMaterialDifference = !!event.differentEventRationale;

  return (
    <div className="space-y-8">
      {/* Top breadcrumb & back */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setLocation('/events')}
          className="flex items-center gap-1.5 text-[11px] text-[#869197] hover:text-[#dce1dc] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Canonical Events</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setLocation('/risk/scores/RS-FED-RATE-CUT')}
            className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#1a201b]"
          >
            <span>Risk Score (78)</span>
            <ArrowRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => setLocation('/impact/IMP-FED-RATE-CUT')}
            className="flex items-center gap-1.5 rounded border border-[#485c33] bg-[#1a2516] px-3 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#22311c]"
          >
            <span>Dollar Impact ($18.4M)</span>
            <ArrowRight size={13} />
          </button>
          {event.signalId && (
            <button
              type="button"
              onClick={() => setLocation(`/signals/${event.signalId}`)}
              className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1.5 text-[11px] text-[#939da2] hover:text-[#dce1dc]"
            >
              <span>Signal Flow</span>
              <ArrowRight size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setProvenanceOpen(true)}
            className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1.5 text-[11px] text-[#939da2] hover:border-[#424d53] hover:text-[#dce1dc]"
          >
            <FileCheck2 size={13} />
            <span>View provenance</span>
          </button>
          <button
            type="button"
            onClick={() => setIsWatchlisted(!isWatchlisted)}
            className={`flex items-center gap-1.5 rounded border px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isWatchlisted
                ? 'border-[#b8f34a]/60 bg-[#161f14] text-[#b8f34a]'
                : 'border-[#2b3337] bg-[#14181b] text-[#939da2] hover:border-[#424d53] hover:text-[#dce1dc]'
            }`}
          >
            {isWatchlisted ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
            <span>{isWatchlisted ? 'Watchlisted' : 'Add to watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Low Confidence or Review Warning Banner (Section 46) */}
      {(event.status === 'LOW_CONFIDENCE' || event.status === 'REVIEW') && (
        <div className="rounded-[8px] border border-[#6b5832] bg-[#1e1911] p-4 text-[11px]">
          <div className="flex items-start gap-3">
            <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#f5c76c]" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#f5c76c] uppercase tracking-[.08em] text-[10px]">
                  {event.status === 'LOW_CONFIDENCE' ? 'LOW CONFIDENCE EVENT' : 'REVIEW REQUIRED'}
                </span>
                <span className="text-[#594d34]">·</span>
                <span className="mono text-[#f5c76c]">Identity confidence {event.identityConfidencePct.toFixed(1)}%</span>
              </div>
              <p className="mt-1 text-[#d8c89f] leading-relaxed">
                {event.sameEventRationale.explanation} Downstream market consensus may be unstable until semantic ambiguities are verified.
              </p>
              <button
                type="button"
                onClick={() => setLocation('/matching')}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#f5c76c] hover:underline"
              >
                <span>Review matching in review queue</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header (Section 5) */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="mono rounded bg-[#172015] px-2 py-0.5 font-semibold text-[#b8f34a]">
            {event.status}
          </span>
          <span className="mono text-[#6c777d]">{event.id}</span>
          <span className="text-[#3a4348]">·</span>
          <span className="text-[#9aa4a9]">{event.category}</span>
        </div>

        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#f2f4ef] sm:text-[26px]">
          {event.title}
        </h1>
        <p className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[#8f9aa0]">
          {event.description}
        </p>

        {/* Header Meta Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#1f2427] pt-5 sm:grid-cols-5">
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">IDENTITY CONFIDENCE</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#b8f34a]">
              {event.identityConfidencePct.toFixed(1)}%
            </div>
            <span className="text-[9px] text-[#616b71]">Statistical linkage</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">CONSENSUS PROBABILITY</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {event.consensusProbabilityPct.toFixed(1)}%
            </div>
            <span className="text-[9px] text-[#616b71]">Venue-weighted</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">MATCHED CONTRACTS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {event.contractsCount}
            </div>
            <span className="text-[9px] text-[#616b71]">Reconciled sources</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">PREDICTION VENUES</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {event.venuesCount}
            </div>
            <span className="text-[9px] text-[#616b71]">{event.venues.join(' · ')}</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">DATA FRESHNESS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#8e989e]">
              {event.freshness}
            </div>
            <span className="text-[9px] text-[#616b71]">Real-time pipeline</span>
          </div>
        </div>
      </section>

      {/* Section 6: Canonical Event Identity */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-6">
        <div className="border-b border-[#1f2427] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            STANDARDIZED SPECIFICATION
          </span>
          <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">Event Identity</h2>
          <p className="mt-1 text-[12px] text-[#899398]">
            Normalized institutional schema reconciling varied exchange questions into a single authoritative record.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">SUBJECT</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.subject}</span>
          </div>
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">LOCATION</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.location}</span>
          </div>
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">TIME WINDOW</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.timeWindow}</span>
          </div>
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5 sm:col-span-2">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">OUTCOME BOUNDARY</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.outcomeDefinition}</span>
          </div>
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">EVENT TYPE</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.eventType}</span>
          </div>
          <div className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3.5 sm:col-span-3">
            <span className="block text-[8px] font-semibold tracking-[.14em] text-[#667076]">AUTHORITATIVE RESOLUTION SOURCE</span>
            <span className="mt-1 block text-[13px] font-medium text-[#edf0ec]">{event.resolutionSource}</span>
          </div>
        </div>
      </section>

      {/* Section 7: Event Fingerprint Visualization */}
      <EventFingerprintCard
        formula={event.fingerprint.formula}
        time={event.fingerprint.time}
        location={event.fingerprint.location}
        outcome={event.fingerprint.outcome}
        subject={event.fingerprint.subject}
        components={event.fingerprint.components}
      />

      {/* Section 8: Raw vs Normalized Data */}
      <RawVsNormalizedCard
        rawQuestion={event.normalizationDetails.rawQuestion}
        rawDescription={event.normalizationDetails.rawDescription}
        rawResolutionRules={event.normalizationDetails.rawResolutionRules}
        parsedTime={event.normalizationDetails.parsedTime}
        parsedLocation={event.normalizationDetails.parsedLocation}
        parsedOutcome={event.normalizationDetails.parsedOutcome}
        parsedSubject={event.normalizationDetails.parsedSubject}
        normalizedStatement={event.normalizationDetails.normalizedStatement}
        confidencePct={event.normalizationDetails.confidencePct}
      />

      {/* Section 9: Matched Contracts Associated With This Event */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-4">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              ASSOCIATED CONTRACT PORTFOLIO
            </span>
            <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
              Contracts Associated With This Event
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setLocation('/matching')}
            className="flex items-center gap-1.5 text-[11px] text-[#b8f34a] hover:underline"
          >
            <span>View matching analysis workspace</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {event.associatedContracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col justify-between rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1d2225] pb-2 text-[9px]">
                  <span className="font-semibold text-[#8ca3b8]">{contract.venue}</span>
                  <span className="mono text-[#6c777d]">{contract.id}</span>
                </div>
                <h3 className="mt-2.5 text-[13px] font-medium leading-snug text-[#edf1eb]">
                  {contract.question}
                </h3>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-[#6c767b]">Probability:</span>
                    <div className="mono font-semibold text-[#edf0ec]">{contract.probabilityPct}%</div>
                  </div>
                  <div>
                    <span className="text-[#6c767b]">Liquidity:</span>
                    <div className="mono font-semibold text-[#edf0ec]">${contract.liquidityUsdM}M</div>
                  </div>
                  <div>
                    <span className="text-[#6c767b]">Freshness:</span>
                    <div className="mono text-[#8a959a]">{contract.freshness}</div>
                  </div>
                  <div>
                    <span className="text-[#6c767b]">Oracle:</span>
                    <div className="mono font-semibold text-[#b8f34a]">{contract.oracleCompatible}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#1d2225] pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6d777d]">Match Score:</span>
                  <span className="mono font-semibold text-[#b8f34a]">
                    {contract.matchScorePct.toFixed(1)}%
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLocation('/matching')}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded border border-[#262e33] bg-[#121619] py-1.5 text-[10px] text-[#b3bdb7] hover:border-[#38454c] hover:text-[#edf0ec]"
                >
                  <span>View match analysis</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 42 & 43: Why does Exogen consider these the same event? */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-6">
        <div className="border-b border-[#1f2427] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            REASONING & VALIDATION
          </span>
          <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
            Why does Exogen consider these the same event?
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-2.5 text-[11px]">
            <div className="flex items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] px-3.5 py-2">
              <span className="font-semibold text-[#6d777d]">SUBJECT</span>
              <span className="flex items-center gap-1.5 text-[#b8f34a]">
                <CheckCircle2 size={13} /> Same (Federal Reserve / Central Bank authority)
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] px-3.5 py-2">
              <span className="font-semibold text-[#6d777d]">TIME</span>
              <span className="flex items-center gap-1.5 text-[#b8f34a]">
                <CheckCircle2 size={13} /> Same (First FOMC cycle in Q1 2027)
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] px-3.5 py-2">
              <span className="font-semibold text-[#6d777d]">LOCATION</span>
              <span className="flex items-center gap-1.5 text-[#b8f34a]">
                <CheckCircle2 size={13} /> Same (United States monetary jurisdiction)
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] px-3.5 py-2">
              <span className="font-semibold text-[#6d777d]">OUTCOME</span>
              <span className="flex items-center gap-1.5 text-[#b8f34a]">
                <CheckCircle2 size={13} /> Semantically equivalent (≥50 basis points reduction)
              </span>
            </div>
            <div className="flex items-center justify-between rounded border border-[#21272b] bg-[#0c0f11] px-3.5 py-2">
              <span className="font-semibold text-[#6d777d]">RESOLUTION</span>
              <span className="flex items-center gap-1.5 text-[#b8f34a]">
                <CheckCircle2 size={13} /> Same authoritative source (FOMC / Board of Governors)
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#78848a]">Overall Match Confidence:</span>
                <span className="mono text-[14px] font-semibold text-[#b8f34a]">
                  {event.sameEventRationale.overallConfidencePct}%
                </span>
              </div>
              <p className="mt-3 leading-relaxed text-[#9aa3a8]">
                {event.sameEventRationale.explanation}
              </p>
              {event.sameEventRationale.nuanceNote && (
                <p className="mt-2 text-[10px] text-[#78848a] italic">
                  Note: {event.sameEventRationale.nuanceNote}
                </p>
              )}
            </div>

            <div className="mt-4 border-t border-[#1f2427] pt-3 text-[10px] text-[#616b71]">
              Derived via pair-linkage engine v0.1 · Illustrative calibrated model output.
            </div>
          </div>
        </div>
      </section>

      {/* Provenance Drawer (Section 35 & 36) */}
      {provenanceOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProvenanceOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="provenance-title"
            className="w-full max-w-[460px] bg-[#111417] border-l border-[#262e33] flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#20272b] pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck2 size={15} className="text-[#b8f34a]" />
                  <h3 id="provenance-title" className="text-[14px] font-semibold text-[#edf1eb]">
                    Event Provenance & Audit Trail
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setProvenanceOpen(false)}
                  className="rounded p-1 text-[#7a8489] hover:bg-[#181d20] hover:text-[#d3d8d5]"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-4 space-y-2 rounded border border-[#21272b] bg-[#0c0f11] p-3 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Canonical Event ID:</span>
                  <span className="mono text-[#edf0ec]">{event.provenance.recordId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Created:</span>
                  <span className="mono text-[#edf0ec]">{event.provenance.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Source Contracts:</span>
                  <span className="mono text-[#edf0ec]">{event.provenance.sourceContractsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Normalization Version:</span>
                  <span className="mono text-[#b8f34a]">{event.provenance.normalizationVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Matching Engine:</span>
                  <span className="mono text-[#b8f34a]">{event.provenance.matchingEngineVersion}</span>
                </div>
              </div>

              {/* Source Chain */}
              <div className="mt-5">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                  REPRODUCIBILITY SOURCE CHAIN
                </span>
                <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                  <div className="rounded bg-[#15191c] p-2 text-[#9da7ac]">
                    01. Ingestion: Raw feed from Polymarket & Kalshi
                  </div>
                  <div className="rounded bg-[#15191c] p-2 text-[#9da7ac]">
                    02. Normalization: Syntactic entity extraction
                  </div>
                  <div className="rounded bg-[#15191c] p-2 text-[#9da7ac]">
                    03. Fingerprint: F=(T, L, O, S) generated
                  </div>
                  <div className="rounded bg-[#15191c] p-2 text-[#9da7ac]">
                    04. Pairwise Matching: Fellegi-Sunter scoring
                  </div>
                  <div className="rounded bg-[#15191c] p-2 text-[#9da7ac]">
                    05. Decision: Auto-merge approved (96.8%)
                  </div>
                  <div className="rounded bg-[#1a2318] p-2 text-[#b8f34a]">
                    06. Canonical Event: CE-000184 active
                  </div>
                </div>
              </div>

              {/* Audit Log (Section 36) */}
              <div className="mt-6">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                  DECISION HISTORY TIMELINE
                </span>
                <div className="mt-2.5 space-y-2">
                  {event.provenance.auditLog.map((log, i) => (
                    <div key={i} className="rounded border border-[#1f2427] bg-[#0c0f11] p-2.5 text-[10px]">
                      <div className="flex items-center justify-between text-[#687277]">
                        <span className="mono">{log.timestamp}</span>
                        <span className="mono text-[#8c979d]">{log.actor}</span>
                      </div>
                      <div className="mt-1 font-medium text-[#edf0ec]">{log.action}</div>
                      <p className="mt-0.5 text-[#869196]">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#20272b] pt-4">
              <button
                type="button"
                onClick={() => setProvenanceOpen(false)}
                className="w-full rounded bg-[#171b1e] py-2 text-[11px] font-medium text-[#cdd3cf] hover:bg-[#202529]"
              >
                Close Provenance Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
