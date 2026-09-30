import { useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'wouter';
import { intelligenceScenarios } from '@/data/intelligence';
import { RiskBadge } from '@/components/overview/Status';
import type { RiskLevel } from '@/components/overview/Status';

type Filter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

export default function Signals() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const signals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return intelligenceScenarios.filter((scenario) => {
      const matchesQuery = !normalized || [
        scenario.signal.title,
        scenario.signal.source,
        scenario.signal.category,
        scenario.risk.name,
      ].some((value) => value.toLowerCase().includes(normalized));
      const matchesFilter = filter === 'ALL' || scenario.signal.riskLevel === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <div className="page-enter">
      <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#1d2225] pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded border border-[#b8f34a]/20 bg-[#b8f34a]/[.06] px-2 py-1 text-[8px] font-semibold tracking-[.15em] text-[#b8f34a]">SIGNAL MONITOR</span>
            <span className="text-[9px] tracking-[.04em] text-[#60686d]">JPMORGAN CHASE · DEMO DATA</span>
          </div>
          <h1 className="text-[27px] font-medium leading-[1.14] tracking-[-.045em] text-[#f4f5f1] sm:text-[32px]">External signals</h1>
          <p className="mt-[7px] text-[12px] text-[#8f979c]">Market changes connected to company-specific risk and impact.</p>
        </div>
        <div className="mono text-[10px] text-[#717a7f]">{intelligenceScenarios.length} DEMO SCENARIOS</div>
      </div>

      <section aria-label="Search and filter signals" className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-md border border-[#282e31] bg-[#111416] px-3 text-[#788186] focus-within:border-[#718448]">
          <Search size={14} />
          <span className="sr-only">Search signals</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search signals, source, or risk category..."
            data-testid="signals-search"
            className="min-w-0 flex-1 bg-transparent text-[11px] text-[#e7e9e4] outline-none placeholder:text-[#646c71]"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-[9px] text-[#687176] sm:inline-flex"><SlidersHorizontal size={12} /> RISK</span>
          <div role="group" aria-label="Filter signals by risk" className="flex rounded-md border border-[#282e31] bg-[#0d1011] p-[3px]">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as Filter[]).map((value) => (
              <button
                key={value}
                type="button"
                data-testid={`signal-filter-${value.toLowerCase()}`}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`rounded px-2.5 py-[6px] text-[8px] font-medium tracking-[.06em] transition-colors ${filter === value ? 'bg-[#242a21] text-[#c6f574]' : 'text-[#788186] hover:text-[#d7dad6]'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between text-[9px] text-[#687176]">
        <span>{signals.length} signals match this view</span>
        <span className="hidden tracking-[.08em] sm:inline">RANKED BY MODELED DOLLAR IMPACT</span>
      </div>

      {signals.length > 0 ? (
        <div className="panel divide-y divide-[#24282c] overflow-hidden">
          {signals.map((scenario) => (
            <button
              key={scenario.signal.id}
              type="button"
              data-testid={`signal-row-${scenario.signal.id}`}
              onClick={() => setLocation(`/signals/${encodeURIComponent(scenario.signal.id)}`)}
              className="group grid w-full grid-cols-1 gap-4 px-4 py-4 text-left transition-colors hover:bg-[#15191a] sm:px-5 lg:grid-cols-[minmax(220px,1.8fr)_minmax(110px,.75fr)_minmax(125px,.9fr)_minmax(110px,.75fr)_auto] lg:items-center"
            >
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a]" />
                  <span className="text-[8px] font-semibold tracking-[.12em] text-[#b8f34a]">{scenario.signal.status}</span>
                  <span className="mono text-[8px] text-[#555e63]">{scenario.signal.eventId}</span>
                </div>
                <h2 className="text-[12px] font-medium leading-5 text-[#e7e9e4] transition-colors group-hover:text-[#c6f574]">{scenario.signal.title}</h2>
                <p className="mt-1 text-[9px] text-[#727b80]">{scenario.signal.source} · {scenario.signal.category}</p>
              </div>
              <div>
                <div className="mono text-[16px] tracking-[-.035em] text-[#e9ebe7]">{scenario.signal.probabilityPct.toFixed(1)}%</div>
                <div className="mt-1 text-[8px] text-[#717a7f]">Market probability</div>
              </div>
              <div>
                <div className="mono text-[14px] tracking-[-.04em] text-[#c6f574]">${scenario.impact.downsideUsdM.toFixed(1)}M</div>
                <div className="mt-1 text-[8px] text-[#717a7f]">Illustrative downside</div>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge level={scenario.signal.riskLevel as RiskLevel} />
                <span className="text-[9px] text-[#777f84]">{scenario.signal.strength} signal</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] text-[#899296] transition-colors group-hover:text-[#c6f574] sm:justify-self-end">Investigate <ArrowRight size={12} /></span>
            </button>
          ))}
        </div>
      ) : (
        <section className="panel px-5 py-10 text-center">
          <h2 className="text-[12px] font-medium text-[#d9dcd7]">No matching signals</h2>
          <p className="mt-2 text-[10px] text-[#788186]">Try another search term or clear the risk filter.</p>
          <button type="button" data-testid="clear-signal-filters" onClick={() => { setQuery(''); setFilter('ALL'); }} className="mt-4 rounded border border-[#303639] px-3 py-2 text-[9px] text-[#c6f574] transition-colors hover:bg-[#b8f34a]/[.08]">Clear filters</button>
        </section>
      )}

      <p className="mt-4 border-t border-[#1e2326] pt-3 text-[9px] text-[#5f686d]">Demonstration data only. Probabilities, risk levels, and exposure values are illustrative—not forecasts or actual JPMorgan Chase exposures.</p>
    </div>
  );
}