import { useState } from 'react';
import { ArrowDown, Check, ChevronRight, Fingerprint, Info } from 'lucide-react';
import type { FingerprintComponentDetail } from '@/types/canonical-matching';

interface Props {
  formula: string;
  time: string;
  location: string;
  outcome: string;
  subject: string;
  components: FingerprintComponentDetail[];
}

export function EventFingerprintCard({ formula, time, location, outcome, subject, components }: Props) {
  const [activeCode, setActiveCode] = useState<'T' | 'L' | 'O' | 'S'>('T');

  const activeComp = components.find((c) => c.code === activeCode) || components[0];

  const blocks: { code: 'T' | 'L' | 'O' | 'S'; title: string; value: string; color: string }[] = [
    { code: 'T', title: 'TIME', value: time, color: 'text-[#96bcff]' },
    { code: 'L', title: 'LOCATION', value: location, color: 'text-[#d8b4e2]' },
    { code: 'O', title: 'OUTCOME', value: outcome, color: 'text-[#b8f34a]' },
    { code: 'S', title: 'SUBJECT', value: subject, color: 'text-[#f5c76c]' },
  ];

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint size={14} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">CANONICAL IDENTIFIER</span>
          </div>
          <h2 className="mt-1 text-[17px] font-medium text-[#f1f3ee]">Event Fingerprint</h2>
        </div>
        <div className="mono rounded border border-[#2b3337] bg-[#161a1d] px-3 py-1 text-[12px] text-[#b8f34a]">
          {formula}
        </div>
      </div>

      <p className="mt-3 text-[12px] text-[#8e989d]">
        Immutable 4-tuple representing the real-world state boundary. Click any coordinate to inspect cross-venue extraction sources and extraction confidence.
      </p>

      {/* Responsive Fingerprint Grid / Flow */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Flow blocks */}
        <div className="flex flex-col gap-2">
          {blocks.map((block, idx) => {
            const isSelected = activeCode === block.code;
            return (
              <div key={block.code} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActiveCode(block.code)}
                  className={`group relative flex w-full items-center justify-between rounded-[6px] border p-3 text-left transition-all ${
                    isSelected
                      ? 'border-[#b8f34a]/60 bg-[#161d16] shadow-[0_0_12px_rgba(184,243,74,0.06)]'
                      : 'border-[#23292d] bg-[#131619] hover:border-[#394247] hover:bg-[#171b1e]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded border border-[#2b3338] bg-[#0f1214] font-mono text-[11px] font-semibold ${block.color}`}
                    >
                      {block.code}
                    </span>
                    <div>
                      <span className="block text-[9px] font-semibold tracking-[.14em] text-[#6d777d]">
                        {block.title}
                      </span>
                      <span className="block text-[12px] font-medium text-[#ebeee9]">{block.value}</span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-[#667076] transition-transform ${isSelected ? 'rotate-90 text-[#b8f34a]' : 'group-hover:text-[#a0aaaf]'}`}
                  />
                </button>
                {idx < blocks.length - 1 && (
                  <div className="py-1 text-[#3b4348]">
                    <ArrowDown size={12} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Component Inspection Panel */}
        {activeComp && (
          <div className="flex flex-col justify-between rounded-[6px] border border-[#272e33] bg-[#0e1113] p-4 text-[11px]">
            <div>
              <div className="flex items-center justify-between border-b border-[#1e2326] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="mono rounded bg-[#182017] px-2 py-0.5 text-[10px] font-semibold text-[#b8f34a]">
                    Coordinate [{activeComp.code}]
                  </span>
                  <span className="font-medium text-[#edf0eb]">{activeComp.name} Vector</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#788287]">Extraction confidence:</span>
                  <span className="mono font-semibold text-[#b8f34a]">{activeComp.extractionConfidencePct.toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#677176]">NORMALIZED STATE</span>
                <div className="mt-1 rounded border border-[#22282c] bg-[#14181a] p-2.5 text-[12px] font-medium text-[#e3e7e2]">
                  {activeComp.normalizedValue}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-[#8a9499]">{activeComp.description}</p>
              </div>

              <div className="mt-4">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#677176]">
                  RAW SOURCE VALUES BY VENUE
                </span>
                <div className="mt-1.5 space-y-1.5">
                  {activeComp.rawValues.map((rv) => (
                    <div
                      key={rv.venue}
                      className="flex items-center justify-between rounded border border-[#1e2327] bg-[#121517] px-3 py-2 text-[11px]"
                    >
                      <span className="mono text-[10px] font-semibold text-[#9da7ac]">{rv.venue}</span>
                      <span className="text-[#d8ded6]">“{rv.value}”</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-[#1e2326] pt-3 text-[10px] text-[#6b767c]">
              <Info size={12} className="text-[#848f94]" />
              <span>Resolved and validated against authoritative federal/market taxonomies.</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
