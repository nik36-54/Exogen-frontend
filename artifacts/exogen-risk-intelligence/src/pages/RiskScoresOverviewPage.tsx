import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  ShieldAlert,
  Sliders,
  TrendingUp,
  Activity,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { riskScoresList } from '@/data/quantitative-intelligence-data';
import { RiskLandscapeBubbleChart } from '@/components/quantitative/RiskLandscapeBubbleChart';
import { RiskThresholdConfigDrawer } from '@/components/quantitative/RiskThresholdConfigDrawer';
import { ScoreMethodologyDrawer } from '@/components/quantitative/ScoreMethodologyDrawer';

export default function RiskScoresOverviewPage() {
  const [, setLocation] = useLocation();
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  const filteredRisks = useMemo(() => {
    return riskScoresList.filter((r) => {
      const matchSearch =
        r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
        r.riskName.toLowerCase().includes(search.toLowerCase()) ||
        r.canonicalEventId.toLowerCase().includes(search.toLowerCase());

      const matchTier = filterTier === 'ALL' || r.category === filterTier;
      return matchSearch && matchTier;
    });
  }, [search, filterTier]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              QUANTITATIVE RISK INTELLIGENCE · LAYER 05
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              v0.1 DEMO
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Risk Scores
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Quantify the relative significance of external events using probability, severity, exposure, propagation, and confidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setMethodologyOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#111416] px-3.5 py-2 text-xs font-medium text-[#92989e] transition hover:bg-[#171a1d] hover:text-[#f5f5f2]"
          >
            How is score calculated?
          </button>
          <button
            onClick={() => setThresholdsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] transition hover:border-[#b8f34a]/60 hover:text-[#b8f34a]"
          >
            <Sliders className="h-3.5 w-3.5" />
            Configure thresholds →
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            ACTIVE SCORED RISKS
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#f5f5f2]">42</div>
        </div>

        <div className="rounded-lg border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff5c5c]">
            HIGH RISK
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#ff5c5c]">7</div>
        </div>

        <div className="rounded-lg border border-[#7c8cff]/30 bg-[#7c8cff]/5 p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#7c8cff]">
            MEDIUM RISK
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#7c8cff]">19</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            LOW RISK
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#92989e]">16</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            AVG SCORE
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#f5f5f2]">54</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            HIGHEST SCORE
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#b8f34a]">91</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            NEW SIGNALS 24H
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#f5f5f2]">3</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            SCORE CHANGES 24H
          </div>
          <div className="mt-1 text-xl font-mono font-bold text-[#b8f34a]">8</div>
        </div>
      </div>

      {/* Risk Landscape (Probability x Severity) */}
      <RiskLandscapeBubbleChart risks={riskScoresList} />

      {/* Dense Institutional Table */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              ACTIVE REGISTRY
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Scored Risk Directory
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#92989e]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter events or risks..."
                className="rounded-lg border border-[#24282c] bg-[#171a1d] py-1.5 pl-8 pr-3 text-xs text-[#f5f5f2] placeholder-[#656b70] focus:border-[#b8f34a] focus:outline-none w-56"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
              {['ALL', 'HIGH', 'MEDIUM'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    filterTier === tier
                      ? 'bg-[#171a1d] text-[#f5f5f2]'
                      : 'text-[#92989e] hover:text-[#f5f5f2]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#24282c] text-[10px] font-mono uppercase text-[#92989e]">
                <th className="py-2.5 px-3">Canonical Event</th>
                <th className="py-2.5 px-3">Risk Classification</th>
                <th className="py-2.5 px-3 text-right">Probability</th>
                <th className="py-2.5 px-3 text-right">Severity</th>
                <th className="py-2.5 px-3 text-right">Exposure</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 text-right">Change 24h</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2225] text-xs">
              {filteredRisks.map((row) => {
                const isPositiveChange = row.scoreChange24h > 0;
                const isNegativeChange = row.scoreChange24h < 0;

                return (
                  <tr
                    key={row.id}
                    onClick={() => setLocation(`/risk/scores/${row.id}`)}
                    className="group hover:bg-[#171a1d] cursor-pointer transition"
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#f5f5f2] group-hover:text-[#b8f34a] max-w-sm truncate">
                        {row.eventTitle}
                      </div>
                      <div className="text-[10px] font-mono text-[#656b70]">
                        {row.canonicalEventId}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-xs text-[#92989e]">{row.riskName}</span>
                      <div className="text-[10px] font-mono text-[#656b70]">{row.riskCategory}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-medium text-[#f5f5f2]">
                      {row.probabilityPct.toFixed(1)}%
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#92989e]">
                      {row.severity}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#92989e]">
                      ${row.modeledExposureUsdM.toFixed(1)}M
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          row.score >= 70
                            ? 'bg-[#b8f34a]/10 text-[#b8f34a]'
                            : row.score >= 40
                            ? 'bg-[#7c8cff]/10 text-[#7c8cff]'
                            : 'bg-[#92989e]/10 text-[#92989e]'
                        }`}
                      >
                        {row.score}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-medium">
                      <span
                        className={
                          isPositiveChange
                            ? 'text-[#ff5c5c]'
                            : isNegativeChange
                            ? 'text-[#b8f34a]'
                            : 'text-[#656b70]'
                        }
                      >
                        {isPositiveChange ? `+${row.scoreChange24h}` : row.scoreChange24h}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#92989e]">
                      {row.confidencePct}%
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#92989e] group-hover:text-[#b8f34a]">
                        Inspect <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawers */}
      <RiskThresholdConfigDrawer
        isOpen={thresholdsOpen}
        onClose={() => setThresholdsOpen(false)}
      />
      <ScoreMethodologyDrawer
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
