import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import {
  Activity, Bell, BookmarkCheck, BriefcaseBusiness, CheckCircle2, ChevronDown, CircleHelp, Command, Database,
  DollarSign, Eye, FileCheck2, GitBranch, History, Layers, LayoutDashboard, Menu, Network, Search, Settings2,
  ShieldAlert, SlidersHorizontal, Sparkles, X, type LucideIcon,
} from 'lucide-react';
import { LiveIndicator } from '../overview/Status';
import { NotificationCenterDrawer } from '../monitoring/NotificationCenterDrawer';
import { SystemMonitoringStatusModal } from '../monitoring/SystemMonitoringStatusModal';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { BreadcrumbBar } from './BreadcrumbBar';
import { useActiveBusinessUnit } from '@/hooks/useActiveBusinessUnit';

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
  { label: 'VALIDATION & EMPIRICAL', items: [
    { label: 'Model Validation', path: '/validation', icon: CheckCircle2 },
    { label: 'Backtesting', path: '/backtesting', icon: SlidersHorizontal },
    { label: 'Calibration', path: '/calibration', icon: Activity },
    { label: 'Historical Replay', path: '/historical-replay', icon: History },
    { label: 'Model Performance', path: '/model-performance', icon: FileCheck2 },
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

export function ExogenShell({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeUnit } = useActiveBusinessUnit();

  const activePath = location === '/' ? '/overview' : location;
  const navPath = activePath.startsWith('/signals/') ? '/signals' : activePath;

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

  const navigate = (path: string) => {
    setLocation(path);
    setMobileOpen(false);
    setSearchOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] text-[#f5f5f2]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[242px] flex-col border-r border-[#1e2225] bg-[#0a0a0b] transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[68px] items-center gap-3 border-b border-[#1e2225] px-6">
          <button
            type="button"
            data-testid="sidebar-logo-button"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            title="EXOGEN"
          >
            <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] border border-[#b8f34a]/30 bg-[#b8f34a]/[.08] group-hover:border-[#b8f34a]/70 group-hover:bg-[#b8f34a]/[.18] transition-all">
              <span className="h-[9px] w-[9px] rotate-45 border-[1.5px] border-[#b8f34a]" />
            </div>
            <span className="text-[15px] font-semibold tracking-[.21em] text-[#f4f5f2] group-hover:text-[#b8f34a] transition-colors">EXOGEN</span>
          </button>
          <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto rounded-md p-1.5 text-[#727a80] hover:bg-[#171a1d] lg:hidden" aria-label="Close navigation"><X size={17} /></button>
        </div>
        <div className="border-b border-[#1e2225] px-4 py-3">
          <button type="button" data-testid="company-selector" onClick={() => navigate(activeUnit ? `/exposure/business-unit/${activeUnit.id}` : '/overview')} className="flex w-full items-center gap-3 rounded-md border border-[#24282c] bg-[#111416] px-3 py-[10px] text-left hover:border-[#3a4044]">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[#1b211a] text-[10px] font-semibold tracking-wide text-[#b8f34a]">JP</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11px] font-medium text-[#dedfdb]">JPMorgan Chase</span>
              <span className="mt-[2px] flex items-center gap-1.5 text-[9px] tracking-[.04em] text-[#869096] truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a] shrink-0" />
                <span className="truncate">{activeUnit ? activeUnit.name : 'Commercial Banking'}</span>
              </span>
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
            <button
              type="button"
              data-testid="header-exogen-button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider text-[#98a1a7] hover:text-[#b8f34a] transition-colors focus:outline-none"
              title="EXOGEN"
            >
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-[#b8f34a]/40 bg-[#b8f34a]/10">
                <span className="h-1.5 w-1.5 rotate-45 border-[1px] border-[#b8f34a]" />
              </span>
              <span className="text-[#f4f5f2] hover:text-[#b8f34a] transition-colors">EXOGEN</span>
            </button>
            <span className="text-[#3b4247]">/</span>
            <span className="truncate font-medium text-[#d7d9d5]">{navPath === '/overview' ? 'Overview' : navLabel(navPath)}</span>
          </div>
          <button
            type="button"
            data-testid="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="mx-3 hidden sm:flex h-[35px] w-[min(410px,40vw)] items-center gap-2.5 rounded-lg border border-[#262c30] bg-[#111417] px-3.5 text-left text-[11px] text-[#788187] transition-all hover:border-[#3c454c] hover:bg-[#14191d] hover:text-[#b4bcba]"
          >
            <Search size={14} className="text-[#879096] shrink-0" />
            <span className="flex-1 truncate">Search signals, events, business units...</span>
            <span className="hidden items-center gap-1 rounded border border-[#30373d] bg-[#171c20] px-[6px] py-[2px] text-[9px] font-mono text-[#8a9298] md:flex">
              <Command size={10} /> K
            </span>
          </button>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-4">
            <button
              type="button"
              data-testid="mobile-search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search signals, events, business units"
              className="rounded p-1.5 text-[#828a8f] hover:bg-[#171a1d] hover:text-[#e0e2de] sm:hidden"
            >
              <Search size={16} />
            </button>
            <div className="hidden sm:block cursor-pointer hover:opacity-80 transition" onClick={() => setStatusModalOpen(true)} title="View system monitoring status"><LiveIndicator compact /></div>
            <button type="button" data-testid="notifications-button" onClick={() => setNotifOpen(true)} aria-label="View notifications & early warnings" className="relative rounded p-1.5 text-[#828a8f] hover:bg-[#171a1d] hover:text-[#e0e2de]"><Bell size={15} /><span className="absolute right-[4px] top-[4px] h-[5px] w-[5px] rounded-full bg-[#b8f34a]" /></button>
            <button type="button" data-testid="top-help-button" onClick={() => navigate('/settings')} aria-label="Help" className="hidden rounded p-1.5 text-[#828a8f] hover:bg-[#171a1d] hover:text-[#e0e2de] sm:block"><CircleHelp size={15} /></button>
            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-full border border-[#393f43] bg-[#171a1d] text-[9px] font-semibold text-[#c5cac7]">AM</div>
          </div>
        </header>
        <BreadcrumbBar />
        <main className="page-enter mx-auto w-full max-w-[1600px] px-4 pb-12 pt-7 sm:px-6 lg:px-8 lg:pt-8">{children}</main>
        <div className="border-t border-[#1c2023] px-4 py-3 text-center text-[9px] tracking-[.04em] text-[#5f676c] sm:px-6 lg:px-8">
          EXOGEN INTELLIGENCE · DEMONSTRATION ENVIRONMENT · JPMORGAN CHASE DATA IS MOCK DATA
        </div>
      </div>

      <NotificationCenterDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <SystemMonitoringStatusModal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} />
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

function navLabel(path: string) {
  if (path.startsWith('/backtesting/events/')) return 'Backtesting / Historical Event Replay';
  if (path.startsWith('/backtesting/warnings')) return 'Backtesting / Early Warnings Sentinel';
  if (path.startsWith('/backtesting/risk-scores')) return 'Backtesting / Risk Score Monotonicity';
  if (path.startsWith('/backtesting/matching')) return 'Backtesting / Canonical Matching';
  if (path.startsWith('/backtesting/propagation')) return 'Backtesting / Propagation Chains';
  if (path.startsWith('/backtesting/impact')) return 'Backtesting / Dollar Impact Bounds';
  if (path.startsWith('/backtesting/')) return 'Backtesting / Run Detail';
  if (path.startsWith('/early-warnings/')) return 'Early Warnings / Warning Detail';
  if (path.startsWith('/risk/propagation')) return 'Risk Propagation / Transmission Path';
  if (path.startsWith('/risk/scores/')) return 'Risk Scores / Score Detail';
  if (path.startsWith('/events/')) return 'Canonical Events / Event Detail';
  if (path.startsWith('/signals/')) return 'Signals / Signal Detail';
  if (path.startsWith('/impact/scenarios')) return 'Scenario Engine & Stress Testing';
  if (path.startsWith('/impact/aggregation')) return 'Impact Aggregation';
  if (path.startsWith('/impact/')) return 'Dollar Impact / Scenario Detail';
  if (path.startsWith('/exposure/business-unit/')) return 'Exposure / Business Unit Detail';

  const item = groups.flatMap((group) => group.items).find((entry) => entry.path === path);
  return item?.label ?? 'Workspace';
}