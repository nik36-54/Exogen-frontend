import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  Activity, Bell, BookmarkCheck, BriefcaseBusiness, ChevronDown, CircleHelp, Command, Database,
  DollarSign, Eye, FileCheck2, GitBranch, Layers, LayoutDashboard, Menu, Network, Search, Settings2,
  ShieldAlert, SlidersHorizontal, Sparkles, X, type LucideIcon,
} from 'lucide-react';
import { LiveIndicator } from '../overview/Status';
import { intelligenceScenarios } from '@/data/intelligence';
import { canonicalEventsList, matchCandidatePairs } from '@/data/canonical-matching-data';
import { riskScoresList } from '@/data/quantitative-intelligence-data';
import { earlyWarningsList, watchlistsMock } from '@/data/monitoring-intelligence-data';
import { NotificationCenterDrawer } from '../monitoring/NotificationCenterDrawer';
import { SystemMonitoringStatusModal } from '../monitoring/SystemMonitoringStatusModal';

type NavItem = { label: string; path: string; icon: LucideIcon };
const groups: { label?: string; items: NavItem[] }[] = [
  { items: [
    { label: 'Overview', path: '/overview', icon: LayoutDashboard },
    { label: 'Executive Monitoring', path: '/monitoring', icon: Eye },
    { label: 'Early Warnings', path: '/early-warnings', icon: Bell },
    { label: 'Watchlists', path: '/watchlist', icon: BookmarkCheck },
    { label: 'Alerts', path: '/alerts', icon: ShieldAlert },
    { label: 'Risk Graph', path: '/risk-graph', icon: Network },
  ] },
  { label: 'RISK & QUANTITATIVE', items: [
    { label: 'Risk Scores', path: '/risk/scores', icon: ShieldAlert },
    { label: 'Risk Propagation', path: '/risk/propagation', icon: GitBranch },
    { label: 'Risk Taxonomy', path: '/risk/taxonomy', icon: Network },
    { label: 'Risk Overview', path: '/risk', icon: ShieldAlert },
  ] },
  { label: 'IMPACT & SCENARIOS', items: [
    { label: 'Dollar Impact', path: '/impact', icon: DollarSign },
    { label: 'Scenario Engine', path: '/impact/scenarios', icon: SlidersHorizontal },
    { label: 'Impact Aggregation', path: '/impact/aggregation', icon: Layers },
    { label: 'Exposure', path: '/exposure', icon: BriefcaseBusiness },
  ] },
  { label: 'INTELLIGENCE', items: [
    { label: 'Signals', path: '/signals', icon: Activity },
    { label: 'Canonical Events', path: '/events', icon: Sparkles },
    { label: 'Data Quality', path: '/data-quality', icon: Database },
    { label: 'Matching', path: '/matching', icon: GitBranch },
  ] },
  { label: 'WORKSPACE', items: [{ label: 'Settings', path: '/settings', icon: Settings2 }] },
];

type SearchResult = { label: string; kind: string; path: string; description: string };
const searchResults: SearchResult[] = [
  { label: 'Executive Monitoring', kind: 'MONITORING', path: '/monitoring', description: 'Command center for continuous sensing & overnight changes' },
  { label: 'Early Warnings Center', kind: 'EARLY WARNINGS', path: '/early-warnings', description: '18 active material change warnings' },
  { label: 'Risk Propagation Timeline', kind: 'PROPAGATION', path: '/risk/propagation', description: 'External Event → Risk → BU → Exposure → Impact' },
  { label: 'JPMorgan Executive Watchlist', kind: 'WATCHLIST', path: '/watchlist', description: 'Persistent tracking of 18 critical risk entities' },
  { label: 'Alert Dispatch Center', kind: 'ALERTS', path: '/alerts', description: 'Configured user sentinel rules & deduplicated notifications' },
  { label: 'Interactive Risk Graph', kind: 'GRAPH', path: '/risk-graph', description: 'Full perimeter causal intelligence map' },
  ...earlyWarningsList.map((w) => ({
    label: `${w.title} (${w.severity.toUpperCase()})`,
    kind: 'WARNING',
    path: `/early-warnings/${w.id}`,
    description: `${w.eventTitle} · ${w.changeValue} · ${w.timeAgo}`,
  })),
  ...riskScoresList.map((rs) => ({
    label: `${rs.eventTitle} (Score: ${rs.score})`,
    kind: 'RISK SCORE',
    path: `/risk/scores/${rs.id}`,
    description: `Score: ${rs.score} (${rs.category}) · Prob: ${rs.probabilityPct.toFixed(1)}% · Exposure: $${rs.modeledExposureUsdM.toFixed(1)}M`,
  })),
  { label: 'Scenario Engine & Calibration', kind: 'SCENARIOS', path: '/impact/scenarios', description: 'Interactive probability & stress magnitude simulation' },
  { label: 'Corporate Impact Aggregation', kind: 'AGGREGATION', path: '/impact/aggregation', description: 'JPMorgan Chase $142.6M exposure · $68.4M expected loss' },
  { label: 'Potential Dollar Impact ($18.4M Downside)', kind: 'IMPACT', path: '/impact/IMP-FED-RATE-CUT', description: 'CE-000184 Fed rate cut · Commercial Banking & Markets' },
  ...intelligenceScenarios.map(({ signal, consensus, impact, id }) => ({
    label: signal.title,
    kind: 'SIGNAL',
    path: `/signals/${id}`,
    description: `${consensus.probabilityPct.toFixed(1)}% consensus · $${impact.downsideUsdM.toFixed(1)}M downside`,
  })),
  ...canonicalEventsList.map((evt) => ({
    label: evt.title,
    kind: 'CANONICAL EVENT',
    path: `/events/${evt.id}`,
    description: `${evt.id} · ${evt.contractsCount} contracts · ${evt.identityConfidencePct.toFixed(1)}% confidence · ${evt.category}`,
  })),
  ...matchCandidatePairs.map((pair) => ({
    label: `${pair.eventATitle} vs ${pair.eventBTitle}`,
    kind: 'MATCHING CASE',
    path: `/matching`,
    description: `${pair.id} · ${pair.matchScorePct.toFixed(1)}% score · ${pair.status}`,
  })),
  { label: 'Federal Reserve rate cut 50bps', kind: 'CONTRACT', path: '/events/CE-000184', description: 'PM-FED-01928471 · Polymarket · 67.4%' },
  { label: 'Brent crude >$120 Dec 2026', kind: 'CONTRACT', path: '/events/CE-000219', description: 'KS-OIL-120-2210 · Kalshi · 40.8%' },
  { label: 'Data Freshness Monitor', kind: 'DATA QUALITY', path: '/data-quality', description: '96.1% fresh data · 37 stale contracts flagged' },
  { label: 'Oracle Compatibility Audit', kind: 'DATA QUALITY', path: '/data-quality', description: '97.4% compatible · 12 unverified oracles' },
  { label: 'JPMorgan Chase', kind: 'COMPANY', path: '/exposure', description: 'Demo company exposure map' },
  { label: 'Supply Chain', kind: 'RISK', path: '/risk', description: '$7.8M potential exposure' },
];

export function ExogenShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  const activePath = location === '/' ? '/overview' : location;
  const navPath = activePath.startsWith('/signals/') ? '/signals' : activePath;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? searchResults.filter((r) => `${r.label} ${r.kind} ${r.description}`.toLowerCase().includes(q)) : searchResults.slice(0, 4);
  }, [query]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelected(0);
      window.setTimeout(() => searchInput.current?.focus(), 30);
    }
  }, [searchOpen]);

  const navigate = (path: string) => {
    setLocation(path);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const onSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelected((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && filtered[selected]) {
      navigate(filtered[selected].path);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] text-[#f5f5f2]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[242px] flex-col border-r border-[#1e2225] bg-[#0a0a0b] transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[68px] items-center gap-3 border-b border-[#1e2225] px-6">
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] border border-[#b8f34a]/30 bg-[#b8f34a]/[.08]">
            <span className="h-[9px] w-[9px] rotate-45 border-[1.5px] border-[#b8f34a]" />
          </div>
          <span className="text-[15px] font-semibold tracking-[.21em] text-[#f4f5f2]">EXOGEN</span>
          <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto rounded-md p-1.5 text-[#727a80] hover:bg-[#171a1d] lg:hidden" aria-label="Close navigation"><X size={17} /></button>
        </div>
        <div className="border-b border-[#1e2225] px-4 py-3">
          <button type="button" data-testid="company-selector" onClick={() => navigate('/overview')} className="flex w-full items-center gap-3 rounded-md border border-[#24282c] bg-[#111416] px-3 py-[10px] text-left hover:border-[#3a4044]">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[#1b211a] text-[10px] font-semibold tracking-wide text-[#b8f34a]">JP</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-medium text-[#dedfdb]">JPMorgan Chase</span>
              <span className="mt-[2px] block text-[9px] tracking-[.04em] text-[#6c7479]">DEMO WORKSPACE</span>
            </span>
            <ChevronDown size={13} className="text-[#687076]" />
          </button>
        </div>
        <nav aria-label="Main navigation" className="soft-scrollbar flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group, groupIndex) => (
            <div className={groupIndex > 0 ? 'mt-[17px] border-t border-[#1d2124] pt-[15px]' : ''} key={group.label || 'primary'}>
              {group.label && <div className="mb-[7px] px-[10px] text-[9px] font-semibold tracking-[.16em] text-[#555d62]">{group.label}</div>}
              <div className="space-y-[2px]">
                {group.items.map(({ label, path, icon: Icon }) => {
                  const isActive = navPath === path;
                  return (
                    <button type="button" key={path} data-testid={`nav-${path.replaceAll('/', '') || 'overview'}`} onClick={() => navigate(path)} aria-current={isActive ? 'page' : undefined}
                      className={`group relative flex h-[35px] w-full items-center gap-[11px] rounded-[5px] px-[10px] text-left text-[11px] transition-colors ${isActive ? 'bg-[#171a1d] text-[#f2f3ef]' : 'text-[#838b90] hover:bg-[#121517] hover:text-[#d6d9d5]'}`}>
                      {isActive && <span className="absolute bottom-[8px] left-0 top-[8px] w-[2px] rounded-r bg-[#b8f34a]" />}
                      <Icon size={14} strokeWidth={1.65} className={isActive ? 'text-[#b8f34a]' : 'text-[#70787e] group-hover:text-[#aeb5b9]'} />
                      <span className="flex-1">{label}</span>
                      {label === 'Early Warnings' && <span className="mono rounded bg-[#26221b] px-1.5 py-[2px] text-[9px] text-[#d9b876]">3</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-[#1e2225] px-5 py-4">
          <div className="flex items-center justify-between cursor-pointer hover:opacity-80 transition" onClick={() => setStatusModalOpen(true)} title="View system monitoring status"><LiveIndicator compact /><span className="mono text-[9px] text-[#60686d]">12s</span></div>
          <div className="mt-[8px] flex items-center justify-between text-[9px] text-[#60686d]"><span>MARKET DATA</span><span className="text-[#777f84]">DEMO · SIMULATED</span></div>
          <div className="mt-3 flex items-center gap-2 border-t border-[#1e2225] pt-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#363c40] bg-[#171a1d] text-[9px] font-semibold text-[#c6cbc8]">AM</div>
            <div className="min-w-0 flex-1"><div className="text-[10px] font-medium text-[#d7d9d5]">Alex Morgan</div><div className="text-[9px] text-[#636b70]">Risk Intelligence</div></div>
            <button type="button" data-testid="help-button" onClick={() => navigate('/settings')} aria-label="Help and workspace settings" className="rounded p-1.5 text-[#727a80] hover:bg-[#171a1d] hover:text-[#ddd]"><CircleHelp size={14} /></button>
          </div>
        </div>
      </aside>

      {mobileOpen && <button type="button" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
      <div className="min-h-[100dvh] lg:pl-[242px]">
        <header className="sticky top-0 z-20 flex h-[60px] items-center border-b border-[#1e2225] bg-[#0a0a0b]/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <button type="button" data-testid="mobile-nav-toggle" onClick={() => setMobileOpen(true)} className="mr-3 rounded-md p-2 text-[#a0a7ab] hover:bg-[#171a1d] lg:hidden" aria-label="Open navigation"><Menu size={17} /></button>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[11px]">
            <span className="hidden text-[#60686d] sm:inline">Workspace</span>
            <span className="hidden text-[#3b4247] sm:inline">/</span>
            <span className="truncate font-medium text-[#d7d9d5]">{navPath === '/overview' ? 'Overview' : navLabel(navPath)}</span>
          </div>
          <button type="button" data-testid="global-search-trigger" onClick={() => setSearchOpen(true)} className="mx-3 flex h-[34px] w-[min(390px,40vw)] items-center gap-2 rounded-md border border-[#252a2d] bg-[#111416] px-3 text-left text-[11px] text-[#747c81] transition-colors hover:border-[#394044]">
            <Search size={13} /><span className="flex-1">Search events, companies, risks...</span><span className="hidden items-center gap-1 rounded border border-[#343a3e] px-[5px] py-[2px] text-[9px] text-[#858d91] md:flex"><Command size={10} /> K</span>
          </button>
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0 sm:gap-5">
            <div className="hidden sm:block cursor-pointer hover:opacity-80 transition" onClick={() => setStatusModalOpen(true)} title="View system monitoring status"><LiveIndicator compact /></div>
            <button type="button" data-testid="notifications-button" onClick={() => setNotifOpen(true)} aria-label="View notifications & early warnings" className="relative rounded p-1.5 text-[#828a8f] hover:bg-[#171a1d] hover:text-[#e0e2de]"><Bell size={15} /><span className="absolute right-[4px] top-[4px] h-[5px] w-[5px] rounded-full bg-[#b8f34a]" /></button>
            <button type="button" data-testid="top-help-button" onClick={() => navigate('/settings')} aria-label="Help" className="hidden rounded p-1.5 text-[#828a8f] hover:bg-[#171a1d] hover:text-[#e0e2de] sm:block"><CircleHelp size={15} /></button>
            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#393f43] bg-[#171a1d] text-[9px] font-semibold text-[#c5cac7]">AM</div>
          </div>
        </header>
        <main className="page-enter mx-auto w-full max-w-[1600px] px-4 pb-12 pt-7 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
        <div className="border-t border-[#1c2023] px-4 py-3 text-center text-[9px] tracking-[.04em] text-[#5f676c] sm:px-6 lg:px-8">
          EXOGEN INTELLIGENCE · DEMONSTRATION ENVIRONMENT · JPMORGAN CHASE DATA IS MOCK DATA
        </div>
      </div>

      <NotificationCenterDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <SystemMonitoringStatusModal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} />

      {searchOpen && (
        <div role="presentation" className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-label="Search Exogen" className="w-full max-w-[560px] overflow-hidden rounded-[10px] border border-[#343a3e] bg-[#111416] shadow-[0_24px_80px_rgba(0,0,0,.6)]">
            <div className="flex h-[54px] items-center gap-3 border-b border-[#24282c] px-4">
              <Search size={16} className="text-[#8a9297]" />
              <input ref={searchInput} value={query} onChange={(e) => { setQuery(e.target.value); setSelected(0); }} onKeyDown={onSearchKeyDown} placeholder="Search Exogen..." data-testid="command-search-input" className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#eeefec] outline-none placeholder:text-[#697176]" />
              <kbd className="rounded border border-[#33393d] px-1.5 py-1 text-[9px] text-[#777f84]">ESC</kbd>
            </div>
            <div className="px-3 pb-3 pt-3">
              <div className="mb-2 px-2 text-[9px] font-semibold tracking-[.15em] text-[#626a6f]">{query ? 'SEARCH RESULTS' : 'RECENT'}</div>
              {filtered.length ? filtered.map((result, index) => (
                <button type="button" key={result.label} data-testid={`search-result-${index}`} onMouseEnter={() => setSelected(index)} onClick={() => navigate(result.path)} className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left ${selected === index ? 'bg-[#1b2019]' : 'hover:bg-[#171a1d]'}`}>
                  <span className="flex h-8 w-8 items-center justify-center rounded border border-[#2c3235] bg-[#171a1d]"><Search size={13} className="text-[#879095]" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-[#e2e4df]">{result.label}</span><span className="mt-1 block truncate text-[10px] text-[#747c81]">{result.description}</span></span>
                  <span className="text-[8px] font-semibold tracking-[.1em] text-[#6a7277]">{result.kind}</span>
                </button>
              )) : <p className="px-2 py-5 text-center text-[11px] text-[#777f84]">No matching intelligence in this demo workspace.</p>}
              <div className="mt-2 flex items-center gap-3 border-t border-[#24282c] px-2 pt-3 text-[9px] text-[#626a6f]"><span>↑↓ navigate</span><span>↵ open</span><span className="ml-auto">DEMO INDEX</span></div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function navLabel(path: string) {
  const item = groups.flatMap((group) => group.items).find((entry) => entry.path === path);
  return item?.label ?? 'Overview';
}