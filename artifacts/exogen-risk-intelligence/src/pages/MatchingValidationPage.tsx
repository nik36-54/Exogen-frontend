import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { matchingThresholdTradeoffs } from '@/data/validation-intelligence-data';
import { ValidationMethodologyDrawer } from '@/components/validation/ValidationMethodologyDrawer';

export default function MatchingValidationPage() {
  const [, setLocation] = useLocation();
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [thresholdScore, setThresholdScore] = useState<number>(8.0);

  const currentTradeoff =
    matchingThresholdTradeoffs.find((t) => t.thresholdScore === thresholdScore) ||
    matchingThresholdTradeoffs[2];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setLocation('/backtesting')}
          className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Backtesting</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/matching')}
          className="text-xs text-[#b8f34a] hover:underline flex items-center gap-1"
        >
          <span>Live Matching Desk</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Header (Section 34) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              FELLEGI-SUNTER RECORD LINKAGE · LAYER 07
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              4,812 ADJUDICATED PAIRS
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Matching Validation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Evaluate whether Exogen's 4-fingerprint matching decisions correctly identify when two prediction market contracts represent the exact same underlying real-world event.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <BookOpen size={14} className="text-[#b8f34a]" />
            <span>Linkage Guide</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Pairwise Precision</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">94.1%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">true match</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">False merge: 2.1%</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Pairwise Recall</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">91.7%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">coverage</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">False split: 4.8%</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">F1-Score Harmonic Mean</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#b8f34a]">0.929</span>
            <span className="text-[10px] font-mono text-[#6c7479]">balanced</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">Benchmark v2.1</div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4">
          <div className="text-[10px] font-mono text-[#8d969b] uppercase">Supervisory Review Rate</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-[#f5f5f2]">8.4%</span>
            <span className="text-[10px] font-mono text-[#6c7479]">adjudicated</span>
          </div>
          <div className="mt-1 text-[11px] text-[#6c7479]">404 pairs routed to human</div>
        </div>
      </div>

      {/* Threshold Simulation & Error Tradeoff (Section 35 & 36) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#f5f5f2]">
              Fellegi-Sunter Decision Threshold Simulation
            </h3>
            <p className="text-xs text-[#8d969b]">
              Simulate how altering log-odds cutoff scores balances automatic merges vs supervisory review queue.
            </p>
          </div>
          <span className="text-xs font-mono text-[#b8f34a]">
            Active Merge Cutoff: +{thresholdScore.toFixed(1)} log-odds
          </span>
        </div>

        {/* Radio/Button group for threshold */}
        <div className="flex items-center gap-2">
          {matchingThresholdTradeoffs.map((t) => (
            <button
              key={t.thresholdScore}
              type="button"
              onClick={() => setThresholdScore(t.thresholdScore)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition ${
                thresholdScore === t.thresholdScore
                  ? 'border-[#b8f34a] bg-[#18231a] text-[#b8f34a] font-bold'
                  : 'border-[#24282c] bg-[#161a1d] text-[#8d969b] hover:text-[#f5f5f2]'
              }`}
            >
              Cutoff +{t.thresholdScore.toFixed(1)}
            </button>
          ))}
        </div>

        {/* Dynamic Tradeoff Output */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
            <span className="text-[#8d969b] block text-[10px]">Precision</span>
            <span className="text-lg font-bold text-[#b8f34a] mt-0.5 block">{currentTradeoff.precisionPct}%</span>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
            <span className="text-[#8d969b] block text-[10px]">Recall</span>
            <span className="text-lg font-bold text-[#f5f5f2] mt-0.5 block">{currentTradeoff.recallPct}%</span>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
            <span className="text-[#8d969b] block text-[10px]">False Merge Rate</span>
            <span className="text-lg font-bold text-[#ff7b72] mt-0.5 block">{currentTradeoff.falseMergeRatePct}%</span>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
            <span className="text-[#8d969b] block text-[10px]">Review Queue (Pairs)</span>
            <span className="text-lg font-bold text-[#e5c07b] mt-0.5 block">{currentTradeoff.reviewVolume}</span>
          </div>
        </div>
      </div>

      {/* Historical Review Replay (Section 37) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#f5f5f2] border-b border-[#1f2427] pb-3">
          Historical Adjudication Replay (Sample Case)
        </h3>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <div className="font-semibold text-[#f5f5f2]">
                PM-FED-01928471 (Polymarket) vs KS-FED-50-2509 (Kalshi)
              </div>
              <div className="text-[11px] text-[#8d969b]">
                Target: Federal Reserve 50bps rate reduction at September FOMC
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#2b2518] px-2 py-0.5 text-[10px] font-mono text-[#e5c07b] border border-[#4a3c26]">
                Automated: REVIEW (Score 6.8)
              </span>
              <span className="rounded bg-[#182619] px-2 py-0.5 text-[10px] font-mono text-[#7ee787] border border-[#2e5030]">
                Adjudicated: MATCH
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-[11px] font-mono bg-[#0d0f11] p-3 rounded border border-[#24282c]">
            <div>
              <span className="text-[#6c7479] block text-[9px]">TEMPORAL (T)</span>
              <span className="text-[#7ee787] font-bold">100% Match</span>
            </div>
            <div>
              <span className="text-[#6c7479] block text-[9px]">LEXICAL (L)</span>
              <span className="text-[#7ee787] font-bold">88.4% Match</span>
            </div>
            <div>
              <span className="text-[#6c7479] block text-[9px]">ORACLE (O)</span>
              <span className="text-[#e5c07b] font-bold">72.0% (Minor wording diff)</span>
            </div>
            <div>
              <span className="text-[#6c7479] block text-[9px]">SEMANTIC (S)</span>
              <span className="text-[#7ee787] font-bold">96.2% Match</span>
            </div>
          </div>

          <p className="text-xs text-[#a0a8af] leading-relaxed">
            <strong>Learning Loop:</strong> The oracle wording difference between Polymarket’s Bloomberg resolution clause and Kalshi’s Fed H.15 press release was audited by risk operations and incorporated into the model dictionary for v0.3.
          </p>
        </div>
      </div>

      <ValidationMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
