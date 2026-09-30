import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Database, Eye, FileText, Filter, GitBranch, Layers3, Sparkles } from 'lucide-react';

interface StageInfo {
  id: string;
  name: string;
  subtitle: string;
  metric: string;
  detail: string;
  inputs?: string[];
  outputs?: string[];
}

const stages: StageInfo[] = [
  {
    id: 'raw',
    name: 'Raw Market Data',
    subtitle: 'Polymarket · Kalshi · Venues',
    metric: '4,821 contracts',
    detail: 'Decentralized and regulated prediction venue feeds ingested continuously via WebSocket and REST adapters.',
    inputs: ['Orderbooks', 'Market titles', 'Resolution rules'],
    outputs: ['Raw payload stream'],
  },
  {
    id: 'normalization',
    name: 'Normalization',
    subtitle: 'Syntactic & semantic parsing',
    metric: '96.1% confidence',
    detail: 'Transforms varied colloquial questions into clean, canonical semantic statements with resolved timeframes and entities.',
    inputs: ['Unstructured text'],
    outputs: ['Parsed attributes'],
  },
  {
    id: 'fingerprint',
    name: 'Fingerprint',
    subtitle: 'F = (T, L, O, S)',
    metric: '4 distinct vectors',
    detail: 'Generates immutable 4-tuple coordinates: Time (T), Location (L), Outcome (O), Subject (S) for high-speed indexing.',
    inputs: ['Time', 'Location', 'Outcome', 'Subject'],
    outputs: ['Coordinate hash'],
  },
  {
    id: 'matching',
    name: 'Matching',
    subtitle: 'Pairwise Fellegi–Sunter',
    metric: '91.7% match rate',
    detail: 'Classifies cross-venue pairs into Merge (≥ 0.90), Review (0.65–0.89), or Keep Distinct (< 0.65) with feature weight attribution.',
    inputs: ['Candidate pairs'],
    outputs: ['Merge / Distinct / Review'],
  },
  {
    id: 'canonical',
    name: 'Canonical Event',
    subtitle: 'Consolidated real-world event',
    metric: '1,284 events',
    detail: 'Singular institutional representation of an external real-world event with identity confidence and provenance audit trail.',
    inputs: ['Resolved pairs'],
    outputs: ['Canonical identity'],
  },
  {
    id: 'consensus',
    name: 'Market Consensus',
    subtitle: 'Weighted probability synthesis',
    metric: 'Downstream risk ready',
    detail: 'Derives venue-weighted true probability consensus feeds for JPMorgan risk, exposure, and dollar impact modeling.',
    inputs: ['Venue liquidity & freshness'],
    outputs: ['Consensus probability'],
  },
];

export function SignaturePipelineVisualizer() {
  const [selectedStage, setSelectedStage] = useState<string>('fingerprint');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const activeStage = stages.find((s) => s.id === selectedStage) || stages[2];

  return (
    <section className="mb-8 rounded-[8px] border border-[#23292d] bg-[#0d1012] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">EXOGEN RESOLUTION ARCHITECTURE</span>
            <span className="text-[#3a4247]">·</span>
            <span className="text-[10px] text-[#788287]">Signature Intelligence Pipeline</span>
          </div>
          <h2 className="mt-1 text-[15px] font-medium text-[#edf0eb]">
            From Raw Prediction Contracts to Verified Canonical Events
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-2.5 py-1 text-[10px] text-[#939da2] hover:border-[#404a50] hover:text-[#d3d8d5]"
        >
          {isExpanded ? 'Collapse pipeline' : 'Expand pipeline'}
          <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="pt-4">
          {/* Visual flow diagram */}
          <div className="overflow-x-auto pb-3">
            <div className="flex min-w-[760px] items-stretch gap-2">
              {stages.map((stage, idx) => {
                const isSelected = selectedStage === stage.id;
                return (
                  <div key={stage.id} className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedStage(stage.id)}
                      className={`group relative flex h-full w-full flex-col justify-between rounded-[6px] border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-[#b8f34a]/60 bg-[#161c16] shadow-[0_0_12px_rgba(184,243,74,0.08)]'
                          : 'border-[#22272b] bg-[#121517] hover:border-[#353d42] hover:bg-[#15191c]'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute -top-1 left-3 h-[2px] w-6 bg-[#b8f34a]" />
                      )}
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="mono text-[8px] tracking-[.1em] text-[#606a70]">
                            0{idx + 1}
                          </span>
                          <span
                            className={`mono text-[9px] ${
                              isSelected ? 'text-[#b8f34a]' : 'text-[#859096]'
                            }`}
                          >
                            {stage.metric}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] font-semibold tracking-[-0.01em] text-[#e3e6e1]">
                          {stage.name}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-[9px] text-[#758086]">
                          {stage.subtitle}
                        </div>
                      </div>

                      {stage.id === 'matching' && (
                        <div className="mt-2.5 flex items-center gap-1 border-t border-[#23292c] pt-2 text-[8px] text-[#8e989d]">
                          <span className="text-[#a4e142]">MERGE</span>
                          <span>·</span>
                          <span className="text-[#d8b568]">REV</span>
                          <span>·</span>
                          <span className="text-[#899399]">DIST</span>
                        </div>
                      )}
                      {stage.id === 'fingerprint' && (
                        <div className="mt-2.5 border-t border-[#23292c] pt-2 text-[8px] font-mono text-[#a4e142]">
                          F=(T,L,O,S)
                        </div>
                      )}
                      {stage.id !== 'matching' && stage.id !== 'fingerprint' && (
                        <div className="mt-2.5 flex items-center gap-1 border-t border-[#23292c] pt-2 text-[8px] text-[#6b767c]">
                          <span>Active stage</span>
                        </div>
                      )}
                    </button>
                    {idx < stages.length - 1 && (
                      <div className="flex shrink-0 px-1 text-[#333a3f]">
                        <ArrowRight size={13} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detailed Drawer / Card */}
          <div className="mt-3 rounded-[6px] border border-[#262c30] bg-[#121618] p-4 text-[11px]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202528] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#b8f34a]">
                  Stage Inspector
                </span>
                <span className="text-[#3b4348]">/</span>
                <span className="font-medium text-[#edf0eb]">{activeStage.name}</span>
                <span className="text-[10px] text-[#7a858a]">({activeStage.subtitle})</span>
              </div>
              <span className="mono text-[10px] text-[#b8f34a]">{activeStage.metric}</span>
            </div>
            <p className="mt-2.5 max-w-4xl text-[12px] leading-relaxed text-[#949fa4]">
              {activeStage.detail}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded border border-[#1f2427] bg-[#0e1113] p-2.5">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#69747a]">INPUT VECTORS</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {activeStage.inputs?.map((inItem) => (
                    <span key={inItem} className="mono rounded bg-[#171c1f] px-2 py-0.5 text-[9px] text-[#c7ccc5]">
                      {inItem}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded border border-[#1f2427] bg-[#0e1113] p-2.5">
                <span className="text-[9px] font-semibold tracking-[.12em] text-[#69747a]">STAGE OUTPUT</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {activeStage.outputs?.map((outItem) => (
                    <span key={outItem} className="mono rounded bg-[#1b2319] px-2 py-0.5 text-[9px] text-[#b9f24d]">
                      {outItem}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
