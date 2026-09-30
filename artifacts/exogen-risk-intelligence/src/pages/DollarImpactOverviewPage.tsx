import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  DollarSign,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { RiskScoreVsImpactTable } from '@/components/quantitative/RiskScoreVsImpactTable';

export default function DollarImpactOverviewPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('ALL');

  const impactTableRows = [
    {
      id: 'IMP-FED-RATE-CUT',
      eventTitle: 'Fed benchmark rate cut ≥50bps',
      eventId: 'CE-000184',
      riskName: 'Interest Rate Risk',
      businessUnit: 'Commercial Banking',
      probabilityPct: 66.1,
      exposureUsdM: 6.8,
      scenario: 'Downside',
      impactUsdM: 4.4,
    },
    {
      id: 'IMP-FED-RATE-CUT-MKT',
      eventTitle: 'Fed benchmark rate cut ≥50bps',
      eventId: 'CE-000184',
      riskName: 'Interest Rate Risk',
      businessUnit: 'Markets (Fixed Income)',
      probabilityPct: 66.1,
      exposureUsdM: 5.1,
      scenario: 'Downside',
      impactUsdM: 3.3,
    },
    {
      id: 'IMP-OIL-SHOCK',
      eventTitle: 'Brent crude oil >$120/barrel',
      eventId: 'CE-000219',
      riskName: 'Commodity Risk',
      businessUnit: 'Syndicated Energy Finance',
      probabilityPct: 41.8,
      exposureUsdM: 19.2,
      scenario: 'Downside',
      impactUsdM: 13.1,
    },
    {
      id: 'IMP-GSIB-REG',
      eventTitle: 'Enhanced G-SIB capital adequacy rule',
      eventId: 'CE-000304',
      riskName: 'Regulatory Capital Risk',
      businessUnit: 'Treasury & Corporate',
      probabilityPct: 38.4,
      exposureUsdM: 34.7,
      scenario: 'Downside',
      impactUsdM: 22.6,
    },
    {
      id: 'IMP-CHIP-EXPORT',
      eventTitle: 'Semiconductor foundry export block',
      eventId: 'CE-000412',
      riskName: 'Technology Supply Risk',
      businessUnit: 'Technology & Operations',
      probabilityPct: 29.5,
      exposureUsdM: 22.4,
      scenario: 'Severe',
      impactUsdM: 15.2,
    },
    {
      id: 'IMP-CRE-DEFAULT',
      eventTitle: 'Office commercial mortgage default >8.5%',
      eventId: 'CE-000529',
      riskName: 'Commercial Real Estate Credit',
      businessUnit: 'Real Estate Banking',
      probabilityPct: 52.3,
      exposureUsdM: 18.9,
      scenario: 'Base',
      impactUsdM: 9.9,
    },
  ];

  const filteredRows = impactTableRows.filter((r) => {
    const matchSearch =
      r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.businessUnit.toLowerCase().includes(search.toLowerCase()) ||
      r.riskName.toLowerCase().includes(search.toLowerCase());

    const matchScenario =
      scenarioFilter === 'ALL' || r.scenario.toUpperCase() === scenarioFilter.toUpperCase();

    return matchSearch && matchScenario;
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              QUANTITATIVE RISK INTELLIGENCE · LAYER 05
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              ILLUSTRATIVE / DEMO MODEL
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Potential Dollar Impact
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Explore modeled financial impact across events, risks, business units, and scenarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setLocation('/impact/scenarios')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] transition hover:border-[#b8f34a]/60 hover:text-[#b8f34a]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Scenario Engine →
          </button>
          <button
            onClick={() => setLocation('/impact/aggregation')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#111416] px-3.5 py-2 text-xs font-medium text-[#92989e] transition hover:bg-[#171a1d] hover:text-[#f5f5f2]"
          >
            <Layers className="h-3.5 w-3.5" />
            Impact Aggregation
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            TOTAL MODELED IMPACT
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#b8f34a]">
            $142.6M
          </div>
          <div className="mt-1 text-[11px] text-[#656b70]">
            Gross scenario exposure across active events
          </div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            EXPECTED IMPACT
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#f5f5f2]">
            $68.4M
          </div>
          <div className="mt-1 text-[11px] text-[#656b70]">
            Probability-weighted modeled consequence
          </div>
        </div>

        <div className="rounded-xl border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff5c5c]">
            DOWNSIDE EXPOSURE
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#ff5c5c]">
            $96.2M
          </div>
          <div className="mt-1 text-[11px] text-[#92989e]">
            Under moderate macro stress assumption
          </div>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            HIGH-IMPACT EVENTS
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-[#7c8cff]">
            7
          </div>
          <div className="mt-1 text-[11px] text-[#656b70]">
            Events exceeding $10.0M downside hurdle
          </div>
        </div>
      </div>

      {/* Conceptual Glossary / Terminology Cards (Section 30) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5">
          <div className="text-xs font-semibold text-[#f5f5f2] flex items-center gap-1.5">
            <span className="font-mono text-[#b8f34a]">01.</span> EXPOSURE
          </div>
          <p className="mt-1 text-[11px] text-[#92989e] leading-relaxed">
            Underlying modeled amount at risk / balance-sheet asset and liability sensitivity.
          </p>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5">
          <div className="text-xs font-semibold text-[#f5f5f2] flex items-center gap-1.5">
            <span className="font-mono text-[#b8f34a]">02.</span> POTENTIAL IMPACT
          </div>
          <p className="mt-1 text-[11px] text-[#92989e] leading-relaxed">
            Modeled financial consequence under a defined scenario (Base, Downside, Severe).
          </p>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5">
          <div className="text-xs font-semibold text-[#f5f5f2] flex items-center gap-1.5">
            <span className="font-mono text-[#b8f34a]">03.</span> EXPECTED IMPACT
          </div>
          <p className="mt-1 text-[11px] text-[#92989e] leading-relaxed">
            Probability-weighted modeled impact (P_M × Modeled Consequence).
          </p>
        </div>
      </div>

      {/* Dense Institutional Impact Table */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              PORTFOLIO ATTRIBUTION TABLE
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Event & Business Unit Financial Impacts
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
                placeholder="Search event or BU..."
                className="rounded-lg border border-[#24282c] bg-[#171a1d] py-1.5 pl-8 pr-3 text-xs text-[#f5f5f2] placeholder-[#656b70] focus:border-[#b8f34a] focus:outline-none w-52"
              />
            </div>

            {/* Scenario toggle */}
            <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
              {['ALL', 'DOWNSIDE', 'BASE', 'SEVERE'].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScenarioFilter(sc)}
                  className={`px-2 py-1 rounded-md transition ${
                    scenarioFilter === sc
                      ? 'bg-[#171a1d] text-[#f5f5f2]'
                      : 'text-[#92989e] hover:text-[#f5f5f2]'
                  }`}
                >
                  {sc}
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
                <th className="py-2.5 px-3">Business Unit</th>
                <th className="py-2.5 px-3 text-right">Probability</th>
                <th className="py-2.5 px-3 text-right">Exposure</th>
                <th className="py-2.5 px-3">Scenario</th>
                <th className="py-2.5 px-3 text-right">Impact</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2225] text-xs">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setLocation(`/impact/${row.id}`)}
                  className="group hover:bg-[#171a1d] cursor-pointer transition"
                >
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#f5f5f2] group-hover:text-[#b8f34a] max-w-xs truncate">
                      {row.eventTitle}
                    </div>
                    <div className="text-[10px] font-mono text-[#656b70]">{row.eventId}</div>
                  </td>

                  <td className="py-3 px-3 text-[#92989e]">{row.riskName}</td>

                  <td className="py-3 px-3 font-medium text-[#f5f5f2]">{row.businessUnit}</td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-[#f5f5f2]">
                    {row.probabilityPct.toFixed(1)}%
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#92989e]">
                    ${row.exposureUsdM.toFixed(1)}M
                  </td>

                  <td className="py-3 px-3">
                    <span className="rounded bg-[#171a1d] px-2 py-0.5 text-[10px] font-mono border border-[#24282c] text-[#f5f5f2]">
                      {row.scenario}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-[#b8f34a]">
                    ${row.impactUsdM.toFixed(1)}M
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#92989e] group-hover:text-[#b8f34a]">
                      Inspect <ArrowRight className="h-3 w-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytical Comparison: Risk Score vs Dollar Impact */}
      <RiskScoreVsImpactTable />
    </div>
  );
}
