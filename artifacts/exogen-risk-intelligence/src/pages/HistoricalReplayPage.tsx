import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck2,
  GitBranch,
  History,
  Layers,
  Network,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { signatureFedReplayEvent } from '@/data/validation-intelligence-data';
import { ReplayController } from '@/components/validation/ReplayController';
import { ReplayKnowledgeCard } from '@/components/validation/ReplayKnowledgeCard';
import { ReplayMiniGraph } from '@/components/validation/ReplayMiniGraph';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function HistoricalReplayPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [tickIndex, setTickIndex] = useState(3); // Default at T-18.4h (warning trigger moment)

  const replayEvent = signatureFedReplayEvent;
  const currentTick = replayEvent.ticks[tickIndex] || replayEvent.ticks[0];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header (Section 19 & 20) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              TIME-TRAVEL FORENSICS · HISTORICAL RECONSTRUCTION
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              TEMPORAL ISOLATION PROTOCOL
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Historical Replay
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Reconstruct what Exogen would have seen, believed, and warned about at a specific historical point in time. Future information is strictly blinded.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Methodology</span>
          </button>

          <button
            type="button"
            onClick={() => setLocation('/risk-graph')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <Network size={14} className="text-[#b8f34a]" />
            <span>Full Risk Graph →</span>
          </button>
        </div>
      </div>

      {/* Case Header Banner */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#6c7479]">REPLAY CASE: {replayEvent.eventId}</span>
            <span className="text-[10px] font-mono text-[#b8f34a] bg-[#172016] px-2 py-0.5 rounded border border-[#b8f34a]/30">
              {replayEvent.category}
            </span>
          </div>
          <h2 className="text-base font-semibold text-[#f5f5f2]">
            {replayEvent.title}
          </h2>
          <p className="text-xs text-[#8d969b]">
            Target Period: {replayEvent.date} · Official Announcement: {replayEvent.resolutionTime}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-center">
            <span className="text-[9px] text-[#6c7479] block">VERIFIED OUTCOME</span>
            <span className="font-bold text-[#7ee787]">100% (OCCURRED)</span>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] px-3 py-2 text-center">
            <span className="text-[9px] text-[#6c7479] block">WARNING LEAD TIME</span>
            <span className="font-bold text-[#b8f34a]">18.4 HOURS</span>
          </div>
        </div>
      </div>

      {/* Scrubbable Replay Controller (Section 21) */}
      <ReplayController
        ticks={replayEvent.ticks}
        currentIndex={tickIndex}
        onSelectIndex={setTickIndex}
      />

      {/* Main Forensic Grid: Knowledge Card & Mini Graph (Section 22, 23, 85) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: "What did Exogen know at this moment?" */}
        <div className="lg:col-span-7 space-y-6">
          <ReplayKnowledgeCard tick={currentTick} />

          {/* Forensic Comparison Card: Prediction at T vs Final Outcome (Section 25 & 81) */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <h3 className="text-sm font-semibold text-[#f5f5f2]">
                Snapshot Forecast vs. Realized Outturn
              </h3>
              <span className="text-[10px] font-mono text-[#6c7479]">COMPARATIVE AUDIT</span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
                <span className="text-[10px] text-[#8d969b] block">Forecast at {currentTick.label}</span>
                <span className="text-xl font-bold text-[#f5f5f2] mt-1 block">
                  {currentTick.probabilityPct.toFixed(1)}%
                </span>
                <span className="text-[9px] text-[#6c7479]">Market Consensus</span>
              </div>

              <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
                <span className="text-[10px] text-[#8d969b] block">Realized Event Outcome</span>
                <span className="text-xl font-bold text-[#7ee787] mt-1 block">
                  100%
                </span>
                <span className="text-[9px] text-[#6c7479]">Occurred (1.0)</span>
              </div>

              <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
                <span className="text-[10px] text-[#8d969b] block">Instantaneous Error</span>
                <span className="text-xl font-bold text-[#b8f34a] mt-1 block">
                  {(100 - currentTick.probabilityPct).toFixed(1)}pp
                </span>
                <span className="text-[9px] text-[#6c7479]">
                  Brier gap: {(Math.pow(1 - currentTick.probabilityPct / 100, 2)).toFixed(3)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-[#1e2a1d] bg-[#111712] p-3 text-xs text-[#a0b39f] leading-relaxed">
              <strong>Forensic Takeaway:</strong> As time advanced from T-77h to T-18.4h, Exogen’s consensus probability escalated from 42.0% to 66.1%, crossing the risk policy threshold and delivering <strong>18.4 hours of early warning advance notice</strong> to JPMorgan Treasury and ALCO committees.
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Dynamic Causal Graph Replay (Section 85) */}
        <div className="lg:col-span-5 space-y-6">
          <ReplayMiniGraph tick={currentTick} />

          {/* Temporal Evolution Timeline */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-3">
            <h4 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-2">
              Timeline Evolution Log
            </h4>
            <div className="space-y-2 text-xs font-mono">
              {replayEvent.ticks.map((t, idx) => {
                const isSelected = idx === tickIndex;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setTickIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition ${
                      isSelected
                        ? 'border-[#b8f34a]/60 bg-[#162015] text-[#f5f5f2]'
                        : 'border-[#24282c] bg-[#161a1d] text-[#8d969b] hover:border-[#384046]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          t.warningTriggered
                            ? 'bg-[#ff5c5c]'
                            : idx === replayEvent.ticks.length - 1
                            ? 'bg-[#b8f34a]'
                            : 'bg-[#6c7479]'
                        }`}
                      />
                      <span>{t.label}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>Prob: {t.probabilityPct}%</span>
                      <span className={t.riskScore >= 70 ? 'text-[#ff5c5c]' : 'text-[#f5f5f2]'}>
                        Score: {t.riskScore}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
