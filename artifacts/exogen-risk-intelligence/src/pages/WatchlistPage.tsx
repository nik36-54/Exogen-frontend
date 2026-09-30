import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  BookmarkCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Bell,
  Sparkles,
  Check,
  Pause,
  Play,
  Trash2,
} from 'lucide-react';
import { watchlistsMock } from '@/data/monitoring-intelligence-data';
import type { WatchlistItem } from '@/types/monitoring-intelligence';
import { AlertBuilderDrawer } from '@/components/monitoring/AlertBuilderDrawer';

export default function WatchlistPage() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<WatchlistItem[]>(watchlistsMock);
  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);
  const [selectedEntityForAlert, setSelectedEntityForAlert] = useState<string>('');

  const groups = ['ALL', 'JPMorgan Executive Monitoring', 'Macro & Commodities', 'Regulatory & Compliance', 'Geopolitics & Supply Chain'];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.entityId.toLowerCase().includes(search.toLowerCase());

      const matchGroup = activeGroup === 'ALL' || item.group === activeGroup;
      return matchSearch && matchGroup;
    });
  }, [items, search, activeGroup]);

  const toggleStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'PAUSED' ? 'WATCHING' : 'PAUSED' }
          : item
      )
    );
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenAlertFor = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntityForAlert(name);
    setAlertDrawerOpen(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              PERSISTENT SURVEILLANCE · LAYER 06
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              USER PORTFOLIO
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Watchlist
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Monitor the external events, risks, and balance sheet exposures that matter most to your enterprise.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedEntityForAlert('Federal Reserve rate cut');
              setAlertDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a]"
          >
            <Bell className="h-3.5 w-3.5" />
            Create Alert Rule
          </button>
        </div>
      </div>

      {/* Metrics Strip (Section 29) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">WATCHED ITEMS</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#f5f5f2]">{items.length}</div>
        </div>

        <div className="rounded-lg border border-[#b8f34a]/30 bg-[#b8f34a]/5 p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#b8f34a]">CHANGED TODAY</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#b8f34a]">7</div>
        </div>

        <div className="rounded-lg border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#ff5c5c]">NEW WARNINGS</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#ff5c5c]">4</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">SCORE CHANGES</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#f5f5f2]">5</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">EXPOSURE SHIFTS</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#7c8cff]">3</div>
        </div>
      </div>

      {/* Primary Watchlist Table */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        {/* Group Filter Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          {/* Groups */}
          <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1 rounded-md transition ${
                  activeGroup === grp
                    ? 'bg-[#171a1d] text-[#b8f34a] font-bold border border-[#24282c]'
                    : 'text-[#92989e] hover:text-[#f5f5f2]'
                }`}
              >
                {grp === 'ALL' ? 'All Items' : grp.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#92989e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search watchlist..."
              className="rounded-lg border border-[#24282c] bg-[#171a1d] py-1.5 pl-8 pr-3 text-xs text-[#f5f5f2] placeholder-[#656b70] focus:border-[#b8f34a] focus:outline-none w-52"
            />
          </div>
        </div>

        {/* Dense Table (Section 30) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#24282c] text-[10px] font-mono uppercase text-[#92989e]">
                <th className="py-2.5 px-3">Monitored Entity</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Probability</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
                <th className="py-2.5 px-3 text-right">Exposure</th>
                <th className="py-2.5 px-3 text-right">Potential Impact</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2225] text-xs">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    if (item.entityId.startsWith('CE-')) setLocation(`/events/${item.entityId}`);
                  }}
                  className="group hover:bg-[#171a1d] cursor-pointer transition"
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a] max-w-sm truncate">
                      {item.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#656b70]">{item.group}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="rounded bg-[#171a1d] px-1.5 py-0.2 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-[#f5f5f2]">
                    {item.currentProbabilityPct ? `${item.currentProbabilityPct.toFixed(1)}%` : '—'}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold">
                    {item.riskScore ? (
                      <span className={item.riskScore >= 70 ? 'text-[#b8f34a]' : 'text-[#7c8cff]'}>
                        {item.riskScore}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#f5f5f2]">
                    {item.exposureUsdM ? `$${item.exposureUsdM.toFixed(1)}M` : '—'}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-[#b8f34a]">
                    {item.potentialImpactUsdM ? `$${item.potentialImpactUsdM.toFixed(1)}M` : '—'}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#ff5c5c] font-medium">
                    {item.change24h}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                        item.status === 'ALERT_ACTIVE'
                          ? 'bg-[#ff5c5c]/10 text-[#ff5c5c]'
                          : item.status === 'WATCHING'
                          ? 'bg-[#b8f34a]/10 text-[#b8f34a]'
                          : 'bg-[#171a1d] text-[#656b70]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Create Alert"
                        onClick={(e) => handleOpenAlertFor(item.name, e)}
                        className="rounded p-1 text-[#92989e] hover:text-[#b8f34a] hover:bg-[#24282c]"
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title={item.status === 'PAUSED' ? 'Resume' : 'Pause'}
                        onClick={(e) => toggleStatus(item.id, e)}
                        className="rounded p-1 text-[#92989e] hover:text-[#f5f5f2] hover:bg-[#24282c]"
                      >
                        {item.status === 'PAUSED' ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        title="Remove"
                        onClick={(e) => removeItem(item.id, e)}
                        className="rounded p-1 text-[#92989e] hover:text-[#ff5c5c] hover:bg-[#24282c]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change History for Fed Rate Cut (Section 33) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-3">
        <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              DELTA TELEMETRY
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              What Changed Since Last Viewed?
            </h3>
          </div>
          <span className="text-xs font-mono text-[#b8f34a]">FED RATE CUT (CE-000184)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] text-[#656b70]">PROBABILITY DELTA</div>
            <div className="mt-1 font-bold text-[#b8f34a]">+18.0pp</div>
            <div className="text-[9px] text-[#92989e]">vs yesterday 16:00</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] text-[#656b70]">RISK SCORE DELTA</div>
            <div className="mt-1 font-bold text-[#ff5c5c]">+12 points</div>
            <div className="text-[9px] text-[#92989e]">66 → 78 High</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] text-[#656b70]">EXPOSURE DELTA</div>
            <div className="mt-1 font-bold text-[#f5f5f2]">+$8.4M</div>
            <div className="text-[9px] text-[#92989e]">$19.4M → $27.8M</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] text-[#656b70]">DOWNSIDE IMPACT DELTA</div>
            <div className="mt-1 font-bold text-[#ff5c5c]">+$5.1M</div>
            <div className="text-[9px] text-[#92989e]">$13.3M → $18.4M</div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <AlertBuilderDrawer
        isOpen={alertDrawerOpen}
        onClose={() => setAlertDrawerOpen(false)}
      />
    </div>
  );
}
