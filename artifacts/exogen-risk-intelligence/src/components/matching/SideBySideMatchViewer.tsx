import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  GitBranch,
  HelpCircle,
  Layers,
  Scale,
  ShieldAlert,
  Sliders,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { MatchCandidatePair, MatchDecisionType } from '@/types/canonical-matching';

interface Props {
  pair: MatchCandidatePair;
  onDecisionChange?: (newDecision: MatchDecisionType) => void;
  onOpenMergeModal?: () => void;
  onOpenThresholds?: () => void;
}

export function SideBySideMatchViewer({
  pair,
  onDecisionChange,
  onOpenMergeModal,
  onOpenThresholds,
}: Props) {
  const [fellegiExpanded, setFellegiExpanded] = useState(true);
  const [weightsExpanded, setWeightsExpanded] = useState(true);
  const [activeDecision, setActiveDecision] = useState<MatchDecisionType>(pair.status);

  const handleDecision = (decision: MatchDecisionType) => {
    if (decision === 'MERGE') {
      if (onOpenMergeModal) {
        onOpenMergeModal();
      } else {
        setActiveDecision('MERGE');
        onDecisionChange?.('MERGE');
      }
    } else {
      setActiveDecision(decision);
      onDecisionChange?.(decision);
    }
  };

  const getDecisionBadge = (decision: MatchDecisionType) => {
    if (decision === 'MERGE') {
      return (
        <span className="flex items-center gap-1.5 rounded border border-[#4c633a] bg-[#1a2517] px-2.5 py-1 text-[10px] font-semibold text-[#b8f34a]">
          <CheckCircle2 size={12} /> AUTO-MERGE (EQUIVALENT)
        </span>
      );
    }
    if (decision === 'DISTINCT') {
      return (
        <span className="flex items-center gap-1.5 rounded border border-[#3f474d] bg-[#161a1d] px-2.5 py-1 text-[10px] font-semibold text-[#8d989f]">
          <XCircle size={12} /> KEEP DISTINCT (SEPARATE)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 rounded border border-[#6b5832] bg-[#221c13] px-2.5 py-1 text-[10px] font-semibold text-[#f5c76c]">
        <AlertTriangle size={12} /> NEEDS MANUAL REVIEW
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-[#b8f34a]';
    if (score >= 0.65) return 'text-[#f5c76c]';
    return 'text-[#ff6b6b]';
  };

  const getBarColor = (score: number) => {
    if (score >= 0.9) return 'bg-[#b8f34a]';
    if (score >= 0.65) return 'bg-[#f5c76c]';
    return 'bg-[#ff6b6b]';
  };

  return (
    <div className="space-y-6">
      {/* Pair Header Banner */}
      <div className="rounded-[8px] border border-[#252c31] bg-[#111417] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2428] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale size={14} className="text-[#b8f34a]" />
              <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                PAIRWISE RESOLUTION ENGINE
              </span>
              <span className="text-[#3b4348]">·</span>
              <span className="mono text-[10px] text-[#798388]">{pair.id}</span>
            </div>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Side-by-Side Semantic Event Comparison
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {getDecisionBadge(activeDecision)}
            <button
              type="button"
              onClick={onOpenThresholds}
              className="flex items-center gap-1 rounded border border-[#2c3439] bg-[#161a1d] px-2.5 py-1 text-[10px] text-[#8e989d] hover:border-[#424e55] hover:text-[#d7ddd9]"
            >
              <Sliders size={11} />
              <span>Thresholds</span>
            </button>
          </div>
        </div>

        {/* Triple Column Comparison: EVENT A | ANALYSIS | EVENT B */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px_1fr]">
          {/* EVENT A */}
          <div className="rounded-[6px] border border-[#262c31] bg-[#0e1113] p-4 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#1e2326] pb-2.5">
              <span className="text-[9px] font-semibold tracking-[.14em] text-[#758187]">CONTRACT A</span>
              <span className="mono rounded bg-[#171c1f] px-2 py-0.5 text-[9px] text-[#b3b9b4]">
                {pair.venueA}
              </span>
            </div>
            <div className="mt-3 text-[13px] font-medium text-[#edf1eb]">
              {pair.eventATitle}
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">TIME</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventA.time}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">LOCATION</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventA.location}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">SUBJECT</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventA.subject}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">OUTCOME</span>
                <span className="text-[11px] font-medium text-[#dce1db]">{pair.eventA.outcome}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">RESOLUTION</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventA.resolution}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#1d2225] pt-2 text-[10px] text-[#707a7f]">
              <span>Probability: <strong className="mono text-[#edf0eb]">{pair.eventA.probabilityPct}%</strong></span>
              <span>Liquidity: <strong className="mono text-[#edf0eb]">${pair.eventA.liquidityUsdM}M</strong></span>
            </div>
          </div>

          {/* MATCH ANALYSIS (CENTER) */}
          <div className="flex flex-col justify-between rounded-[6px] border border-[#2b343a] bg-[#13171a] p-4 text-[11px]">
            <div>
              <div className="text-center border-b border-[#21272b] pb-2">
                <span className="text-[9px] font-semibold tracking-[.14em] text-[#939da3]">
                  MATCH ANALYSIS
                </span>
                <div className="mono mt-1 text-[22px] font-semibold text-[#f1f4ef]">
                  {pair.matchScorePct.toFixed(1)}%
                </div>
                <span className="text-[9px] text-[#6f797e]">Pairwise Semantic Overlap</span>
              </div>

              {/* Feature scores */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#79848a]">TIME</span>
                  <span className={`mono text-[11px] font-semibold ${getScoreColor(pair.features.time.score)}`}>
                    {pair.features.time.score.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#79848a]">LOCATION</span>
                  <span className={`mono text-[11px] font-semibold ${getScoreColor(pair.features.location.score)}`}>
                    {pair.features.location.score.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#79848a]">SUBJECT</span>
                  <span className={`mono text-[11px] font-semibold ${getScoreColor(pair.features.subject.score)}`}>
                    {pair.features.subject.score.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#79848a]">OUTCOME</span>
                  <span className={`mono text-[11px] font-semibold ${getScoreColor(pair.features.outcome.score)}`}>
                    {pair.features.outcome.score.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#79848a]">RESOLUTION</span>
                  <span className={`mono text-[11px] font-semibold ${getScoreColor(pair.features.resolution.score)}`}>
                    {pair.features.resolution.score.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-[#21272b] pt-3 text-center">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a747a]">DIFFERENCE VECTOR</span>
              <div className="mt-1 rounded border border-[#2b3337] bg-[#0e1113] py-1 text-[10px] text-[#e0e4df]">
                {pair.semanticDifference}
              </div>
            </div>
          </div>

          {/* EVENT B */}
          <div className="rounded-[6px] border border-[#262c31] bg-[#0e1113] p-4 text-[11px]">
            <div className="flex items-center justify-between border-b border-[#1e2326] pb-2.5">
              <span className="text-[9px] font-semibold tracking-[.14em] text-[#758187]">CONTRACT B</span>
              <span className="mono rounded bg-[#171c1f] px-2 py-0.5 text-[9px] text-[#b3b9b4]">
                {pair.venueB}
              </span>
            </div>
            <div className="mt-3 text-[13px] font-medium text-[#edf1eb]">
              {pair.eventBTitle}
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">TIME</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventB.time}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">LOCATION</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventB.location}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">SUBJECT</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventB.subject}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">OUTCOME</span>
                <span className="text-[11px] font-medium text-[#dce1db]">{pair.eventB.outcome}</span>
              </div>
              <div className="rounded border border-[#1d2225] bg-[#131618] p-2">
                <span className="block text-[8px] font-semibold tracking-[.1em] text-[#697378]">RESOLUTION</span>
                <span className="text-[11px] text-[#dce1db]">{pair.eventB.resolution}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#1d2225] pt-2 text-[10px] text-[#707a7f]">
              <span>Probability: <strong className="mono text-[#edf0eb]">{pair.eventB.probabilityPct}%</strong></span>
              <span>Liquidity: <strong className="mono text-[#edf0eb]">${pair.eventB.liquidityUsdM}M</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Fellegi-Sunter Statistical Model View (Section 13) */}
      <div className="rounded-[8px] border border-[#252c31] bg-[#111417] p-5">
        <div className="flex items-center justify-between border-b border-[#1f2428] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              PROBABILISTIC RECORD LINKAGE
            </span>
            <span className="text-[#3b4348]">·</span>
            <h3 className="text-[14px] font-medium text-[#edf0eb]">Fellegi–Sunter Match Analysis</h3>
          </div>
          <span className="mono text-[9px] text-[#737d82]">
            {pair.fellegiSunter.label}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Scores breakdown */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-[#22282c] bg-[#0e1113] p-3 text-center">
                <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">
                  FELLEGI–SUNTER WEIGHT
                </span>
                <div
                  className={`mono mt-1 text-[24px] font-semibold ${
                    pair.fellegiSunter.score >= 0 ? 'text-[#b8f34a]' : 'text-[#ff6b6b]'
                  }`}
                >
                  {pair.fellegiSunter.score >= 0 ? `+${pair.fellegiSunter.score.toFixed(2)}` : pair.fellegiSunter.score.toFixed(2)}
                </div>
                <span className="text-[9px] text-[#6b757b]">Log-likelihood ratio</span>
              </div>
              <div className="rounded border border-[#22282c] bg-[#0e1113] p-3 text-center">
                <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">
                  MATCH PROBABILITY
                </span>
                <div className="mono mt-1 text-[24px] font-semibold text-[#edf1eb]">
                  {pair.fellegiSunter.matchProbabilityPct.toFixed(1)}%
                </div>
                <span className="text-[9px] text-[#6b757b]">Posterior confidence</span>
              </div>
            </div>

            <div className="rounded border border-[#1f2428] bg-[#0c0f11] p-3 text-[10px] text-[#848e93]">
              <span className="font-semibold text-[#cbd1ca]">Algorithm Architecture:</span> Evaluates agreement/disagreement likelihoods against calibrated m-probabilities (P(agree|match)) and u-probabilities (P(agree|unmatched)) across vector fields.
            </div>
          </div>

          {/* Weight Contributions (Section 14) */}
          <div className="rounded border border-[#22282c] bg-[#0e1113] p-4 text-[11px]">
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6e787d]">
              FEATURE WEIGHT CONTRIBUTIONS
            </span>
            <div className="mt-3 space-y-2">
              {Object.entries(pair.features).map(([key, feat]) => {
                const maxWeight = 3.0;
                const pct = Math.min(100, Math.max(8, (feat.weight / maxWeight) * 100));
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="uppercase text-[#848f95]">{key}</span>
                      <span className="mono text-[#cbd2cb]">+{feat.weight.toFixed(1)}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-[#1b2023]">
                      <div
                        className="h-1.5 rounded-full bg-[#b8f34a]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Decision Explainability (Section 17) & Action Bar (Section 19) */}
      <div className="rounded-[8px] border border-[#252c31] bg-[#111417] p-5">
        <div className="border-b border-[#1f2428] pb-3">
          <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
            SYSTEM EXPLAINABILITY
          </span>
          <h3 className="mt-1 text-[15px] font-medium text-[#edf0eb]">
            {pair.decisionRationale.title}
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ul className="space-y-2 text-[12px] text-[#9ba5aa]">
              {pair.decisionRationale.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded border border-[#22292d] bg-[#0d1012] p-3 text-[11px] leading-relaxed text-[#b1bbb4]">
              {pair.decisionRationale.summary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col justify-between rounded border border-[#23292d] bg-[#0e1113] p-4 text-[11px]">
            <div>
              <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                MANUAL RESOLUTION ACTIONS
              </span>
              <p className="mt-1 text-[11px] text-[#869196]">
                Override or confirm matching status for downstream consensus and risk aggregation.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => handleDecision('MERGE')}
                className={`flex-1 rounded border px-3 py-2 text-center text-[11px] font-medium transition-colors ${
                  activeDecision === 'MERGE'
                    ? 'border-[#b8f34a] bg-[#1c2618] text-[#b8f34a]'
                    : 'border-[#2d382d] bg-[#141c13] text-[#b8f34a] hover:border-[#b8f34a]'
                }`}
              >
                Merge Events
              </button>
              <button
                type="button"
                onClick={() => handleDecision('DISTINCT')}
                className={`flex-1 rounded border px-3 py-2 text-center text-[11px] font-medium transition-colors ${
                  activeDecision === 'DISTINCT'
                    ? 'border-[#8f9ba3] bg-[#22272b] text-[#edf1ee]'
                    : 'border-[#2c3337] bg-[#161a1d] text-[#b6c0c5] hover:border-[#414d54]'
                }`}
              >
                Keep Distinct
              </button>
              <button
                type="button"
                onClick={() => handleDecision('REVIEW')}
                className={`flex-1 rounded border px-3 py-2 text-center text-[11px] font-medium transition-colors ${
                  activeDecision === 'REVIEW'
                    ? 'border-[#d4a852] bg-[#272015] text-[#f5c76c]'
                    : 'border-[#393222] bg-[#1a1712] text-[#d6b772] hover:border-[#d4a852]'
                }`}
              >
                Review Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
