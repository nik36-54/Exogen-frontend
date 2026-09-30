import { useState } from 'react';
import { ArrowDown, CheckCircle, ChevronDown, ChevronUp, Code2, Sparkles } from 'lucide-react';

interface Props {
  rawQuestion: string;
  rawDescription: string;
  rawResolutionRules: string;
  parsedTime: string;
  parsedLocation: string;
  parsedOutcome: string;
  parsedSubject: string;
  normalizedStatement: string;
  confidencePct: number;
}

export function RawVsNormalizedCard({
  rawQuestion,
  rawDescription,
  rawResolutionRules,
  parsedTime,
  parsedLocation,
  parsedOutcome,
  parsedSubject,
  normalizedStatement,
  confidencePct,
}: Props) {
  const [technicalOpen, setTechnicalOpen] = useState(false);

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">SEMANTIC EXTRACTION</span>
          </div>
          <h2 className="mt-1 text-[17px] font-medium text-[#f1f3ee]">Raw Contract → Normalized Event</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#7e898e]">Normalization confidence:</span>
          <span className="mono rounded bg-[#172015] px-2.5 py-1 text-[12px] font-medium text-[#b8f34a]">
            {confidencePct.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] items-center">
        {/* Raw side */}
        <div className="rounded-[6px] border border-[#272e33] bg-[#0e1113] p-4 text-[11px]">
          <div className="flex items-center justify-between border-b border-[#1f2428] pb-2 text-[9px] font-semibold tracking-[.14em] text-[#78848a]">
            <span>RAW EXTERNAL CONTRACT</span>
            <span className="mono text-[#5f696f]">SOURCE INPUT</span>
          </div>
          <div className="mt-3 font-serif text-[14px] italic leading-snug text-[#d9dfd7]">
            “{rawQuestion}”
          </div>
          <div className="mt-3 text-[10px] leading-relaxed text-[#7c868c]">
            Colloquial language, venue-specific phrasing, and unstructured conditions.
          </div>
        </div>

        {/* Transition indicator */}
        <div className="flex justify-center text-[#707c82]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#272f33] bg-[#14191c]">
            <ArrowDown size={14} className="text-[#b8f34a]" />
          </div>
        </div>

        {/* Normalized side */}
        <div className="rounded-[6px] border border-[#2d3a2b] bg-[#121913] p-4 text-[11px]">
          <div className="flex items-center justify-between border-b border-[#233022] pb-2 text-[9px] font-semibold tracking-[.14em] text-[#b8f34a]">
            <span>NORMALIZED CANONICAL DEFINITION</span>
            <span className="mono text-[#8ca862]">EXOGEN IDENTITY</span>
          </div>
          <div className="mt-3 text-[14px] font-medium leading-snug text-[#eff4ed]">
            {normalizedStatement}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#9bb38b]">
            <CheckCircle size={12} className="text-[#b8f34a]" />
            <span>Standardized subject, timeframe, sovereign boundary, and threshold.</span>
          </div>
        </div>
      </div>

      {/* Expandable technical view */}
      <div className="mt-5 border-t border-[#1f2428] pt-4">
        <button
          type="button"
          onClick={() => setTechnicalOpen(!technicalOpen)}
          className="flex items-center gap-2 text-[11px] font-medium text-[#9da7ac] hover:text-[#e4e8e3] transition-colors"
        >
          <Code2 size={13} className="text-[#b8f34a]" />
          <span>{technicalOpen ? 'Hide parsed AST & extraction details' : 'Inspect parsed semantic AST & extraction details'}</span>
          {technicalOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {technicalOpen && (
          <div className="mt-4 rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">ORIGINAL SOURCE TEXT</span>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-[10px] text-[#6d777d]">Original title:</span>
                    <p className="mono mt-0.5 rounded bg-[#131619] p-2 text-[10px] text-[#ccd3cc]">{rawQuestion}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6d777d]">Original description:</span>
                    <p className="mt-0.5 rounded bg-[#131619] p-2 text-[10px] text-[#939da2]">{rawDescription}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6d777d]">Resolution rules:</span>
                    <p className="mt-0.5 rounded bg-[#131619] p-2 text-[10px] text-[#939da2]">{rawResolutionRules}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">PARSED ENTITY AST</span>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between rounded bg-[#131619] p-2">
                    <span className="text-[10px] text-[#6d777d]">Parsed Subject:</span>
                    <span className="mono text-[10px] text-[#b8f34a]">{parsedSubject}</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-[#131619] p-2">
                    <span className="text-[10px] text-[#6d777d]">Parsed Location:</span>
                    <span className="mono text-[10px] text-[#b8f34a]">{parsedLocation}</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-[#131619] p-2">
                    <span className="text-[10px] text-[#6d777d]">Parsed Time:</span>
                    <span className="mono text-[10px] text-[#b8f34a]">{parsedTime}</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-[#131619] p-2">
                    <span className="text-[10px] text-[#6d777d]">Parsed Outcome:</span>
                    <span className="mono text-[10px] text-[#b8f34a]">{parsedOutcome}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
