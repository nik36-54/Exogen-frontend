import { useState, useEffect, useRef, useMemo, useCallback, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { useLocation } from 'wouter';
import {
  Search,
  Activity,
  Sparkles,
  Building2,
  Command,
  X,
  ChevronRight,
  Clock,
  History,
  Trash2,
  RotateCcw,
  Check,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { intelligenceScenarios } from '@/data/intelligence';
import { canonicalEventsList } from '@/data/canonical-matching-data';
import { businessUnitsList } from '@/data/risk-intelligence-data';
import { useActiveBusinessUnit } from '@/hooks/useActiveBusinessUnit';

export type SearchCategory = 'ALL' | 'SIGNALS' | 'EVENTS' | 'BUSINESS_UNITS';

export interface GlobalSearchItem {
  id: string;
  category: 'SIGNAL' | 'EVENT' | 'BUSINESS_UNIT';
  title: string;
  subtitle: string;
  path: string;
  badge: string;
  division?: string;
  metrics: {
    primary: string;
    secondary?: string;
  };
  keywords: string[];
}

export interface RecentSearchItem {
  id: string;
  category: 'SIGNAL' | 'EVENT' | 'BUSINESS_UNIT';
  title: string;
  subtitle: string;
  path: string;
  badge: string;
  division?: string;
  viewedAt: string;
  timestamp: number;
}

const STORAGE_KEY = 'exogen_recent_searches_v1';

const DEFAULT_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: 'SIG-FED-CUT',
    category: 'SIGNAL',
    title: 'Federal Reserve cuts rates by 50+ bps before March 2027',
    subtitle: '67.4% consensus · $18.4M downside · Polymarket & Kalshi',
    path: '/signals/SIG-FED-CUT',
    badge: 'SIGNAL',
    viewedAt: '5m ago',
    timestamp: Date.now() - 5 * 60 * 1000,
  },
  {
    id: 'commercial-banking',
    category: 'BUSINESS_UNIT',
    title: 'Commercial Banking',
    subtitle: 'Commercial & Investment Bank · $24.6M modeled exposure · 8 active risks',
    path: '/exposure/business-unit/commercial-banking',
    badge: 'BUSINESS UNIT',
    division: 'Commercial & Investment Bank',
    viewedAt: '18m ago',
    timestamp: Date.now() - 18 * 60 * 1000,
  },
  {
    id: 'SIG-OIL-SHOCK',
    category: 'SIGNAL',
    title: 'Crude oil trades above $100 per barrel this quarter',
    subtitle: '54.2% consensus · $12.8M downside · Kalshi',
    path: '/signals/SIG-OIL-SHOCK',
    badge: 'SIGNAL',
    viewedAt: '1h ago',
    timestamp: Date.now() - 60 * 60 * 1000,
  },
  {
    id: 'markets',
    category: 'BUSINESS_UNIT',
    title: 'Markets',
    subtitle: 'Commercial & Investment Bank · $38.2M modeled exposure · 12 active risks',
    path: '/exposure/business-unit/markets',
    badge: 'BUSINESS UNIT',
    division: 'Commercial & Investment Bank',
    viewedAt: '2h ago',
    timestamp: Date.now() - 120 * 60 * 1000,
  },
  {
    id: 'CE-000184',
    category: 'EVENT',
    title: 'Federal Reserve cuts benchmark rate by ≥50 bps before March 2027',
    subtitle: 'CE-000184 · 94.2% identity confidence · Macro',
    path: '/events/CE-000184',
    badge: 'EVENT',
    viewedAt: '3h ago',
    timestamp: Date.now() - 180 * 60 * 1000,
  },
];

function getStoredRecentSearches(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RECENT_SEARCHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_RECENT_SEARCHES;
  } catch {
    return DEFAULT_RECENT_SEARCHES;
  }
}

function saveRecentSearches(items: RecentSearchItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: SearchCategory;
}

export function GlobalSearchModal({ isOpen, onClose, initialCategory = 'ALL' }: Props) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(initialCategory);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(getStoredRecentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Hook for tracking active business unit across the entire app
  const { activeUnitId, activeUnit, setActiveUnitId, isUnitActive } = useActiveBusinessUnit();

  // Sync recent searches on open
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getStoredRecentSearches());
    }
  }, [isOpen]);

  // Transform raw data sources into unified search items
  const allItems: GlobalSearchItem[] = useMemo(() => {
    const items: GlobalSearchItem[] = [];

    // 1. Signals
    intelligenceScenarios.forEach((sc) => {
      items.push({
        id: sc.signal.id,
        category: 'SIGNAL',
        title: sc.signal.title,
        subtitle: `${sc.signal.source} · ${sc.signal.category} · Updated ${sc.signal.freshness}`,
        path: `/signals/${encodeURIComponent(sc.id)}`,
        badge: 'SIGNAL',
        metrics: {
          primary: `${sc.consensus.probabilityPct.toFixed(1)}% prob`,
          secondary: `$${sc.impact.downsideUsdM.toFixed(1)}M downside`,
        },
        keywords: [
          sc.signal.id,
          sc.signal.title,
          sc.signal.category,
          sc.signal.source,
          sc.label,
          sc.company,
          'signal',
          'market',
          'consensus',
          'probability',
        ],
      });
    });

    // 2. Canonical Events
    canonicalEventsList.forEach((evt) => {
      items.push({
        id: evt.id,
        category: 'EVENT',
        title: evt.title,
        subtitle: `${evt.id} · ${evt.contractsCount} contracts across ${evt.venues.join(', ')} · ${evt.category}`,
        path: `/events/${encodeURIComponent(evt.id)}`,
        badge: 'EVENT',
        metrics: {
          primary: `${evt.identityConfidencePct.toFixed(1)}% match`,
          secondary: `${evt.consensusProbabilityPct.toFixed(1)}% consensus`,
        },
        keywords: [
          evt.id,
          evt.title,
          evt.category,
          evt.description,
          evt.riskCategory || '',
          ...evt.venues,
          'event',
          'canonical',
          'contracts',
        ],
      });
    });

    // 3. Business Units
    businessUnitsList.forEach((bu) => {
      items.push({
        id: bu.id,
        category: 'BUSINESS_UNIT',
        title: bu.name,
        subtitle: `${bu.division} · ${bu.activeRiskEventsCount} active risks · ${bu.description.slice(0, 75)}...`,
        path: `/exposure/business-unit/${encodeURIComponent(bu.id)}`,
        badge: 'BUSINESS UNIT',
        division: bu.division,
        metrics: {
          primary: `$${bu.modeledExposureUsdM.toFixed(1)}M exposure`,
          secondary: `${bu.activeRiskEventsCount} risks`,
        },
        keywords: [
          bu.id,
          bu.name,
          bu.division,
          bu.description,
          ...bu.currentRiskDrivers.map((d) => d.riskName),
          ...bu.currentRiskDrivers.map((d) => d.eventTitle),
          'business unit',
          'bu',
          'exposure',
          'division',
        ],
      });
    });

    return items;
  }, []);

  // Filtered by category and search text
  const filteredItems = useMemo(() => {
    let list = allItems;
    if (selectedCategory === 'SIGNALS') {
      list = list.filter((i) => i.category === 'SIGNAL');
    } else if (selectedCategory === 'EVENTS') {
      list = list.filter((i) => i.category === 'EVENT');
    } else if (selectedCategory === 'BUSINESS_UNITS') {
      list = list.filter((i) => i.category === 'BUSINESS_UNIT');
    }

    const q = query.trim().toLowerCase();
    if (!q) {
      return list;
    }

    return list.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle.toLowerCase().includes(q);
      const matchId = item.id.toLowerCase().includes(q);
      const matchDivision = item.division ? item.division.toLowerCase().includes(q) : false;
      const matchKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(q));
      return matchTitle || matchSubtitle || matchId || matchDivision || matchKeywords;
    });
  }, [allItems, selectedCategory, query]);

  // Group filtered results by type (Signals, Events, Business Units)
  const categorizedResults = useMemo(() => {
    const signals = filteredItems.filter((i) => i.category === 'SIGNAL');
    const events = filteredItems.filter((i) => i.category === 'EVENT');
    const businessUnits = filteredItems.filter((i) => i.category === 'BUSINESS_UNIT');

    return {
      signals,
      events,
      businessUnits,
      total: filteredItems.length,
    };
  }, [filteredItems]);

  // Ordered list of items matching the visual categorized presentation
  const orderedCategorizedItems = useMemo(() => {
    if (selectedCategory === 'SIGNALS') return categorizedResults.signals;
    if (selectedCategory === 'EVENTS') return categorizedResults.events;
    if (selectedCategory === 'BUSINESS_UNITS') return categorizedResults.businessUnits;

    // When ALL: signals first, then events, then business units
    return [
      ...categorizedResults.signals,
      ...categorizedResults.events,
      ...categorizedResults.businessUnits,
    ];
  }, [categorizedResults, selectedCategory]);

  // Filtered recent searches by current category
  const filteredRecentSearches = useMemo(() => {
    if (selectedCategory === 'ALL') return recentSearches;
    if (selectedCategory === 'SIGNALS') return recentSearches.filter((r) => r.category === 'SIGNAL');
    if (selectedCategory === 'EVENTS') return recentSearches.filter((r) => r.category === 'EVENT');
    if (selectedCategory === 'BUSINESS_UNITS') return recentSearches.filter((r) => r.category === 'BUSINESS_UNIT');
    return recentSearches;
  }, [recentSearches, selectedCategory]);

  // Combined selectable list for keyboard navigation (matches order of visual rendering)
  const selectableItems = useMemo(() => {
    if (query.trim() === '') {
      return filteredRecentSearches.map((r) => ({
        id: r.id,
        path: r.path,
        title: r.title,
        subtitle: r.subtitle,
        category: r.category,
        badge: r.badge,
        division: r.division,
        isRecent: true,
      }));
    }
    return orderedCategorizedItems.map((item) => ({
      id: item.id,
      path: item.path,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      badge: item.badge,
      division: item.division,
      isRecent: false,
    }));
  }, [query, filteredRecentSearches, orderedCategorizedItems]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Ensure selected item is scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const recordRecentItem = (item: {
    id: string;
    category: 'SIGNAL' | 'EVENT' | 'BUSINESS_UNIT';
    title: string;
    subtitle: string;
    path: string;
    badge: string;
    division?: string;
  }) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      const newEntry: RecentSearchItem = {
        id: item.id,
        category: item.category,
        title: item.title,
        subtitle: item.subtitle,
        path: item.path,
        badge: item.badge,
        division: item.division,
        viewedAt: 'Just now',
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...filtered].slice(0, 8);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const navigateTo = (item: {
    id: string;
    category: 'SIGNAL' | 'EVENT' | 'BUSINESS_UNIT';
    title: string;
    subtitle: string;
    path: string;
    badge: string;
    division?: string;
  }) => {
    recordRecentItem(item);
    if (item.category === 'BUSINESS_UNIT') {
      setActiveUnitId(item.id);
    }
    setLocation(item.path);
    onClose();
  };

  const removeRecentSearch = (id: string, e: ReactMouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const clearAllRecent = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    saveRecentSearches([]);
  };

  const restoreDefaultRecent = (e: ReactMouseEvent) => {
    e.stopPropagation();
    setRecentSearches(DEFAULT_RECENT_SEARCHES);
    saveRecentSearches(DEFAULT_RECENT_SEARCHES);
  };

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectableItems[selectedIndex]) {
        navigateTo(selectableItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const categories: SearchCategory[] = ['ALL', 'SIGNALS', 'EVENTS', 'BUSINESS_UNITS'];
      const currentIndex = categories.indexOf(selectedCategory);
      const nextIndex = e.shiftKey
        ? (currentIndex - 1 + categories.length) % categories.length
        : (currentIndex + 1) % categories.length;
      setSelectedCategory(categories[nextIndex]);
    }
  };

  // Group counts for category pills
  const counts = {
    all: allItems.length,
    signals: allItems.filter((i) => i.category === 'SIGNAL').length,
    events: allItems.filter((i) => i.category === 'EVENT').length,
    businessUnits: allItems.filter((i) => i.category === 'BUSINESS_UNIT').length,
  };

  // Helper function to render search query matches cleanly
  const renderHighlightedText = (text: string, queryStr: string) => {
    if (!queryStr.trim()) return text;
    const parts = text.split(new RegExp(`(${queryStr.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === queryStr.toLowerCase() ? (
            <mark key={i} className="bg-[#b8f34a]/25 text-[#f4f7f2] font-semibold rounded-[2px] px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      role="presentation"
      data-testid="search-results-dropdown"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 pt-[10vh] sm:pt-[12vh] backdrop-blur-[4px] transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Global Search"
        className="w-full max-w-[720px] overflow-hidden rounded-xl border border-[#2a3036] bg-[#111417] shadow-[0_24px_70px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex h-[56px] items-center gap-3 border-b border-[#22272c] px-4 bg-[#14181c]">
          <Search size={18} className="text-[#848c93] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search signals, events, business units..."
            data-testid="global-search-modal-input"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-[#f2f3ef] placeholder:text-[#6a7278] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded p-1 text-[#727a81] hover:text-[#d0d3cd] transition"
              aria-label="Clear query"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-[#2d343a] bg-[#1a1f24] px-2 py-0.5 text-[10px] font-mono text-[#828a90]">
            ESC
          </kbd>
        </div>

        {/* Category Navigation Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#20252a] px-3 py-2 bg-[#0e1114] overflow-x-auto no-scrollbar">
          <button
            type="button"
            data-testid="filter-all"
            onClick={() => setSelectedCategory('ALL')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              selectedCategory === 'ALL'
                ? 'bg-[#1e252b] text-[#f2f4f0] shadow-sm'
                : 'text-[#828a90] hover:text-[#c4c7c2] hover:bg-[#15191d]'
            }`}
          >
            <span>All Results</span>
            <span className="rounded bg-[#283138] px-1.5 py-0.2 text-[10px] font-mono text-[#9ea7ad]">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            data-testid="filter-signals"
            onClick={() => setSelectedCategory('SIGNALS')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              selectedCategory === 'SIGNALS'
                ? 'bg-[#1b261b] text-[#b8f34a] border border-[#2d422a]'
                : 'text-[#828a90] hover:text-[#c4c7c2] hover:bg-[#15191d]'
            }`}
          >
            <Activity size={13} className={selectedCategory === 'SIGNALS' ? 'text-[#b8f34a]' : 'text-[#70797f]'} />
            <span>Signals</span>
            <span className="rounded bg-[#212f20] px-1.5 py-0.2 text-[10px] font-mono text-[#a6df41]">
              {counts.signals}
            </span>
          </button>

          <button
            type="button"
            data-testid="filter-events"
            onClick={() => setSelectedCategory('EVENTS')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              selectedCategory === 'EVENTS'
                ? 'bg-[#221c2e] text-[#c9a6ff] border border-[#3e2e5c]'
                : 'text-[#828a90] hover:text-[#c4c7c2] hover:bg-[#15191d]'
            }`}
          >
            <Sparkles size={13} className={selectedCategory === 'EVENTS' ? 'text-[#c9a6ff]' : 'text-[#70797f]'} />
            <span>Canonical Events</span>
            <span className="rounded bg-[#2b223c] px-1.5 py-0.2 text-[10px] font-mono text-[#bfa0f5]">
              {counts.events}
            </span>
          </button>

          <button
            type="button"
            data-testid="filter-business-units"
            onClick={() => setSelectedCategory('BUSINESS_UNITS')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
              selectedCategory === 'BUSINESS_UNITS'
                ? 'bg-[#2c2217] text-[#f5c76c] border border-[#523d24]'
                : 'text-[#828a90] hover:text-[#c4c7c2] hover:bg-[#15191d]'
            }`}
          >
            <Building2 size={13} className={selectedCategory === 'BUSINESS_UNITS' ? 'text-[#f5c76c]' : 'text-[#70797f]'} />
            <span>Business Units</span>
            <span className="rounded bg-[#382b1c] px-1.5 py-0.2 text-[10px] font-mono text-[#e6b95d]">
              {counts.businessUnits}
            </span>
          </button>
        </div>

        {/* Results / Recent Searches List View */}
        <div
          ref={listRef}
          data-testid="categorized-results-container"
          className="max-h-[460px] overflow-y-auto p-2 soft-scrollbar"
        >
          {query.trim() === '' ? (
            /* EMPTY QUERY: Display RECENT SEARCHES & QUICK BROWSE */
            <div className="space-y-4 p-1">
              <div className="flex items-center justify-between px-2 pt-1 pb-1">
                <div className="flex items-center gap-2">
                  <History size={14} className="text-[#b8f34a]" />
                  <span className="text-[11px] font-semibold tracking-wider text-[#b8f34a] uppercase">
                    Recent Searches
                  </span>
                  <span className="text-[10px] text-[#6e777e] font-mono">
                    ({filteredRecentSearches.length} {filteredRecentSearches.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {filteredRecentSearches.length > 0 ? (
                    <button
                      type="button"
                      data-testid="clear-recent-searches-btn"
                      onClick={clearAllRecent}
                      className="flex items-center gap-1 text-[10px] text-[#868e94] hover:text-[#ff7b72] transition"
                      title="Clear recent searches history"
                    >
                      <Trash2 size={11} />
                      <span>Clear History</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={restoreDefaultRecent}
                      className="flex items-center gap-1 text-[10px] text-[#868e94] hover:text-[#b8f34a] transition"
                      title="Restore suggested recent items"
                    >
                      <RotateCcw size={11} />
                      <span>Reset Suggestions</span>
                    </button>
                  )}
                </div>
              </div>

              {filteredRecentSearches.length > 0 ? (
                <div className="space-y-1" data-testid="recent-searches-list">
                  {filteredRecentSearches.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    const isUnitItem = item.category === 'BUSINESS_UNIT';
                    const isActiveUnit = isUnitItem && isUnitActive(item.id);

                    return (
                      <div
                        key={`recent-${item.category}-${item.id}`}
                        data-selected={isSelected}
                        data-testid={`recent-search-item-${item.id}`}
                        data-active-business-unit={isActiveUnit ? 'true' : undefined}
                        onClick={() => navigateTo(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition ${
                          isSelected
                            ? 'bg-[#182026] border border-[#2f3f4e]/80 text-[#f5f6f2]'
                            : isActiveUnit
                            ? 'bg-[#151d14]/70 border border-[#2c3d25] text-[#d6ded5]'
                            : 'hover:bg-[#14191d] text-[#cfd3ce] border border-transparent'
                        } ${isActiveUnit ? 'border-l-[3px] border-l-[#b8f34a]' : ''}`}
                      >
                        {/* Icon */}
                        <div className="shrink-0">
                          {item.category === 'SIGNAL' && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2b3d29] bg-[#142014] text-[#b8f34a]">
                              <Activity size={14} />
                            </div>
                          )}
                          {item.category === 'EVENT' && (
                            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#372b4c] bg-[#1d162a] text-[#c9a6ff]">
                              <Sparkles size={14} />
                            </div>
                          )}
                          {item.category === 'BUSINESS_UNIT' && (
                            <div className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                              isActiveUnit
                                ? 'border-[#3f572a] bg-[#172314] text-[#b8f34a]'
                                : 'border-[#44331e] bg-[#22180f] text-[#f5c76c]'
                            }`}>
                              <Building2 size={14} />
                            </div>
                          )}
                        </div>

                        {/* Title and subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-medium text-[#f2f4ef] group-hover:text-white transition-colors">
                              {item.title}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                item.category === 'SIGNAL'
                                  ? 'bg-[#162215] text-[#b8f34a] border-[#293d27]'
                                  : item.category === 'EVENT'
                                  ? 'bg-[#1e1729] text-[#c9a6ff] border-[#37294e]'
                                  : isActiveUnit
                                  ? 'bg-[#1b2615] text-[#b8f34a] border-[#334b25]'
                                  : 'bg-[#271d11] text-[#f5c76c] border-[#42311b]'
                              }`}
                            >
                              {item.badge}
                            </span>

                            {/* Active Business Unit Visual Indicator */}
                            {isActiveUnit && (
                              <span
                                data-testid="active-business-unit-indicator"
                                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#b8f34a]/40 bg-[#b8f34a]/15 px-2 py-0.5 text-[9px] font-mono font-medium text-[#b8f34a] shadow-[0_0_10px_rgba(184,243,74,0.18)]"
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f34a] opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8f34a]" />
                                </span>
                                <span>ACTIVE UNIT</span>
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#7e878e] line-clamp-1">
                            {isActiveUnit ? (
                              <span className="text-[#a4dd3d] font-mono text-[10px] mr-1.5">
                                Current Active Unit in Workspace ·
                              </span>
                            ) : null}
                            {item.subtitle}
                          </p>
                        </div>

                        {/* Relative time & remove */}
                        <div className="flex items-center gap-2.5 shrink-0 pl-2">
                          <span className="flex items-center gap-1 text-[10px] font-mono text-[#737c82]">
                            <Clock size={11} className="text-[#555d64]" />
                            {item.viewedAt}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(item.id, e)}
                            className="rounded p-1 text-[#5c656c] opacity-60 hover:opacity-100 hover:text-[#ff7b72] hover:bg-[#20252a] transition"
                            title="Remove from recent searches"
                            aria-label={`Remove ${item.title} from recent searches`}
                          >
                            <X size={13} />
                          </button>
                          <ChevronRight
                            size={15}
                            className={`transition-transform ${
                              isSelected ? 'text-[#b8f34a] translate-x-0.5' : 'text-[#4e565c]'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#727a81] border border-dashed border-[#22272c] rounded-lg">
                  <History size={18} className="mx-auto mb-1 text-[#464e54]" />
                  <p>No recent searches in this category.</p>
                  <button
                    type="button"
                    onClick={restoreDefaultRecent}
                    className="mt-2 text-[11px] text-[#b8f34a] hover:underline"
                  >
                    Restore default suggested items
                  </button>
                </div>
              )}

              {/* Active Business Unit Summary Banner */}
              {activeUnit && (
                <div className="rounded-lg border border-[#2d3a28] bg-[#121911] p-3 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f34a] opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#b8f34a]" />
                    </span>
                    <div>
                      <div className="text-[10px] font-mono text-[#8a9885] uppercase tracking-wider">
                        Active Workspace Business Unit
                      </div>
                      <div className="text-[12px] font-medium text-[#f2f5ef]">
                        {activeUnit.name} <span className="text-[#88908a] font-normal">({activeUnit.division})</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="jump-to-active-bu"
                    onClick={() => {
                      setLocation(`/exposure/business-unit/${activeUnit.id}`);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 rounded border border-[#3b4e2f] bg-[#1c2918] px-2.5 py-1 text-[11px] font-medium text-[#b8f34a] hover:bg-[#253720] transition"
                  >
                    <span>View Exposures</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}

              {/* Quick hints */}
              <div className="pt-2 border-t border-[#1a1f23] px-2 flex items-center justify-between text-[11px] text-[#6b7379]">
                <span>Type to search all prediction signals, canonical events, and business units</span>
                <span className="font-mono text-[10px] text-[#868e94]">Tab: filter category</span>
              </div>
            </div>
          ) : (
            /* ACTIVE QUERY: DISPLAY CATEGORIZED RESULTS */
            <div className="space-y-4">
              {orderedCategorizedItems.length > 0 ? (
                <>
                  {/* CATEGORY 1: SIGNALS */}
                  {categorizedResults.signals.length > 0 &&
                    (selectedCategory === 'ALL' || selectedCategory === 'SIGNALS') && (
                      <div
                        data-testid="category-section-signals"
                        className="rounded-lg border border-[#232a26] bg-[#121614]/40 overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-[#202722] bg-[#131b15] px-3.5 py-2">
                          <div className="flex items-center gap-2">
                            <Activity size={14} className="text-[#b8f34a]" />
                            <span className="text-[11px] font-semibold tracking-wider text-[#b8f34a] uppercase">
                              Signals
                            </span>
                            <span className="rounded bg-[#1b261b] border border-[#2d422a] px-1.5 py-0.2 text-[10px] font-mono text-[#a6df41]">
                              {categorizedResults.signals.length} {categorizedResults.signals.length === 1 ? 'match' : 'matches'}
                            </span>
                          </div>
                          {selectedCategory === 'ALL' && (
                            <button
                              type="button"
                              onClick={() => setSelectedCategory('SIGNALS')}
                              className="text-[10px] text-[#708070] hover:text-[#b8f34a] transition-colors flex items-center gap-1 font-mono"
                            >
                              <span>Only Signals</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>

                        {/* Items in Signals */}
                        <div className="divide-y divide-[#18211a]">
                          {categorizedResults.signals.map((item) => {
                            const overallIndex = orderedCategorizedItems.findIndex(
                              (it) => it.id === item.id && it.category === item.category
                            );
                            const isSelected = selectedIndex === overallIndex;

                            return (
                              <div
                                key={`sig-${item.id}`}
                                data-selected={isSelected}
                                data-testid={`search-item-${item.id}`}
                                onClick={() => navigateTo(item)}
                                onMouseEnter={() => setSelectedIndex(overallIndex)}
                                className={`group flex items-start gap-3 px-3.5 py-2.5 cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-[#18241b] border-l-2 border-l-[#b8f34a] text-[#f5f6f2]'
                                    : 'hover:bg-[#151c16] text-[#cfd3ce]'
                                }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#2b3d29] bg-[#142014] text-[#b8f34a]">
                                    <Activity size={14} />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[13px] font-medium text-[#f2f4ef] group-hover:text-white transition-colors">
                                      {renderHighlightedText(item.title, query)}
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-[#162215] text-[#b8f34a] border-[#293d27]">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-[#7e878e] line-clamp-1 leading-relaxed">
                                    {renderHighlightedText(item.subtitle, query)}
                                  </p>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end justify-center self-center pl-2">
                                  <span className="text-xs font-mono font-medium text-[#b8f34a]">
                                    {item.metrics.primary}
                                  </span>
                                  {item.metrics.secondary && (
                                    <span className="text-[10px] font-mono text-[#828c83]">
                                      {item.metrics.secondary}
                                    </span>
                                  )}
                                </div>
                                <div className="self-center pl-1">
                                  <ChevronRight
                                    size={15}
                                    className={`transition-transform ${
                                      isSelected ? 'text-[#b8f34a] translate-x-0.5' : 'text-[#4e565c]'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* CATEGORY 2: CANONICAL EVENTS */}
                  {categorizedResults.events.length > 0 &&
                    (selectedCategory === 'ALL' || selectedCategory === 'EVENTS') && (
                      <div
                        data-testid="category-section-events"
                        className="rounded-lg border border-[#2b2438] bg-[#16131c]/40 overflow-hidden"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-[#292036] bg-[#1c1626] px-3.5 py-2">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-[#c9a6ff]" />
                            <span className="text-[11px] font-semibold tracking-wider text-[#c9a6ff] uppercase">
                              Canonical Events
                            </span>
                            <span className="rounded bg-[#221c2e] border border-[#3e2e5c] px-1.5 py-0.2 text-[10px] font-mono text-[#bfa0f5]">
                              {categorizedResults.events.length} {categorizedResults.events.length === 1 ? 'match' : 'matches'}
                            </span>
                          </div>
                          {selectedCategory === 'ALL' && (
                            <button
                              type="button"
                              onClick={() => setSelectedCategory('EVENTS')}
                              className="text-[10px] text-[#86759d] hover:text-[#c9a6ff] transition-colors flex items-center gap-1 font-mono"
                            >
                              <span>Only Events</span>
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>

                        {/* Items in Events */}
                        <div className="divide-y divide-[#20192b]">
                          {categorizedResults.events.map((item) => {
                            const overallIndex = orderedCategorizedItems.findIndex(
                              (it) => it.id === item.id && it.category === item.category
                            );
                            const isSelected = selectedIndex === overallIndex;

                            return (
                              <div
                                key={`evt-${item.id}`}
                                data-selected={isSelected}
                                data-testid={`search-item-${item.id}`}
                                onClick={() => navigateTo(item)}
                                onMouseEnter={() => setSelectedIndex(overallIndex)}
                                className={`group flex items-start gap-3 px-3.5 py-2.5 cursor-pointer transition ${
                                  isSelected
                                    ? 'bg-[#211a2d] border-l-2 border-l-[#c9a6ff] text-[#f5f6f2]'
                                    : 'hover:bg-[#191423] text-[#cfd3ce]'
                                }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#372b4c] bg-[#1d162a] text-[#c9a6ff]">
                                    <Sparkles size={14} />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[13px] font-medium text-[#f2f4ef] group-hover:text-white transition-colors">
                                      {renderHighlightedText(item.title, query)}
                                    </span>
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border bg-[#1e1729] text-[#c9a6ff] border-[#37294e]">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-xs text-[#7e878e] line-clamp-1 leading-relaxed">
                                    {renderHighlightedText(item.subtitle, query)}
                                  </p>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end justify-center self-center pl-2">
                                  <span className="text-xs font-mono font-medium text-[#c9a6ff]">
                                    {item.metrics.primary}
                                  </span>
                                  {item.metrics.secondary && (
                                    <span className="text-[10px] font-mono text-[#8a8197]">
                                      {item.metrics.secondary}
                                    </span>
                                  )}
                                </div>
                                <div className="self-center pl-1">
                                  <ChevronRight
                                    size={15}
                                    className={`transition-transform ${
                                      isSelected ? 'text-[#c9a6ff] translate-x-0.5' : 'text-[#4e565c]'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* CATEGORY 3: BUSINESS UNITS */}
                  {categorizedResults.businessUnits.length > 0 &&
                    (selectedCategory === 'ALL' || selectedCategory === 'BUSINESS_UNITS') && (
                      <div
                        data-testid="category-section-business-units"
                        className="rounded-lg border border-[#382b1d] bg-[#18130d]/40 overflow-hidden"
                      >
                        {/* Section Header with Active Unit Indication */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#302315] bg-[#22180e] px-3.5 py-2">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-[#f5c76c]" />
                            <span className="text-[11px] font-semibold tracking-wider text-[#f5c76c] uppercase">
                              Business Units
                            </span>
                            <span className="rounded bg-[#2c2217] border border-[#523d24] px-1.5 py-0.2 text-[10px] font-mono text-[#e6b95d]">
                              {categorizedResults.businessUnits.length} {categorizedResults.businessUnits.length === 1 ? 'match' : 'matches'}
                            </span>
                          </div>

                          {/* Active Business Unit indicator in section header */}
                          <div className="flex items-center gap-3">
                            {activeUnit && (
                              <div
                                data-testid="active-bu-header-pill"
                                className="flex items-center gap-1.5 text-[10px] font-mono text-[#9e9787]"
                              >
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f34a] opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8f34a]" />
                                </span>
                                <span>Active:</span>
                                <strong className="text-[#b8f34a] font-medium">{activeUnit.name}</strong>
                              </div>
                            )}

                            {selectedCategory === 'ALL' && (
                              <button
                                type="button"
                                onClick={() => setSelectedCategory('BUSINESS_UNITS')}
                                className="text-[10px] text-[#93836d] hover:text-[#f5c76c] transition-colors flex items-center gap-1 font-mono"
                              >
                                <span>Only Units</span>
                                <ChevronRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Items in Business Units */}
                        <div className="divide-y divide-[#281c10]">
                          {categorizedResults.businessUnits.map((item) => {
                            const overallIndex = orderedCategorizedItems.findIndex(
                              (it) => it.id === item.id && it.category === item.category
                            );
                            const isSelected = selectedIndex === overallIndex;
                            const isActiveUnit = isUnitActive(item.id);

                            return (
                              <div
                                key={`bu-${item.id}`}
                                data-selected={isSelected}
                                data-testid={`search-item-${item.id}`}
                                data-active-business-unit={isActiveUnit ? 'true' : undefined}
                                onClick={() => navigateTo(item)}
                                onMouseEnter={() => setSelectedIndex(overallIndex)}
                                className={`group relative flex items-start gap-3 px-3.5 py-2.5 cursor-pointer transition ${
                                  isSelected
                                    ? isActiveUnit
                                      ? 'bg-[#1e2a1b] border-l-[3px] border-l-[#b8f34a] text-[#f5f6f2]'
                                      : 'bg-[#291f13] border-l-[3px] border-l-[#f5c76c] text-[#f5f6f2]'
                                    : isActiveUnit
                                    ? 'bg-[#141e12]/80 border-l-[3px] border-l-[#b8f34a] text-[#dce4db]'
                                    : 'hover:bg-[#1f150c] text-[#cfd3ce]'
                                }`}
                              >
                                <div className="pt-0.5 shrink-0">
                                  <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                                      isActiveUnit
                                        ? 'border-[#3f572a] bg-[#182614] text-[#b8f34a]'
                                        : 'border-[#44331e] bg-[#22180f] text-[#f5c76c]'
                                    }`}
                                  >
                                    <Building2 size={14} />
                                  </div>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[13px] font-medium text-[#f2f4ef] group-hover:text-white transition-colors">
                                      {renderHighlightedText(item.title, query)}
                                    </span>

                                    <span
                                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                        isActiveUnit
                                          ? 'bg-[#192415] text-[#b8f34a] border-[#314725]'
                                          : 'bg-[#271d11] text-[#f5c76c] border-[#42311b]'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>

                                    {/* Visual Indicator for Active Business Unit */}
                                    {isActiveUnit && (
                                      <span
                                        data-testid="active-business-unit-indicator"
                                        className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#b8f34a]/50 bg-[#b8f34a]/15 px-2 py-0.5 text-[9px] font-mono font-medium text-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.22)]"
                                      >
                                        <span className="relative flex h-2 w-2">
                                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8f34a] opacity-75" />
                                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b8f34a]" />
                                        </span>
                                        <span>ACTIVE UNIT</span>
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-0.5 text-xs text-[#7e878e] line-clamp-1 leading-relaxed">
                                    {isActiveUnit && (
                                      <span className="text-[#a4dd3d] font-mono text-[10px] mr-1.5 font-medium">
                                        ★ Currently Active Portfolio Unit ·
                                      </span>
                                    )}
                                    {renderHighlightedText(item.subtitle, query)}
                                  </p>
                                </div>

                                <div className="text-right shrink-0 flex flex-col items-end justify-center self-center pl-2">
                                  <span
                                    className={`text-xs font-mono font-medium ${
                                      isActiveUnit ? 'text-[#b8f34a]' : 'text-[#f5c76c]'
                                    }`}
                                  >
                                    {item.metrics.primary}
                                  </span>
                                  {item.metrics.secondary && (
                                    <span className="text-[10px] font-mono text-[#8c8273]">
                                      {item.metrics.secondary}
                                    </span>
                                  )}
                                </div>

                                <div className="self-center pl-1">
                                  <ChevronRight
                                    size={15}
                                    className={`transition-transform ${
                                      isSelected
                                        ? isActiveUnit
                                          ? 'text-[#b8f34a] translate-x-0.5'
                                          : 'text-[#f5c76c] translate-x-0.5'
                                        : 'text-[#4e565c]'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <div className="py-12 text-center text-xs text-[#7c858c]">
                  <Search size={24} className="mx-auto mb-2 text-[#464e54]" />
                  <p className="font-medium text-[#a2abb1]">No matching signals, events, or business units</p>
                  <p className="mt-1 text-[11px] text-[#697177]">
                    Try adjusting your search terms or select another category filter tab.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex flex-wrap items-center justify-between border-t border-[#1e2328] bg-[#0d1012] px-4 py-2.5 text-[11px] text-[#6b7379]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="rounded border border-[#2b3137] bg-[#15191c] px-1 py-0.5 text-[#8f979d]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="rounded border border-[#2b3137] bg-[#15191c] px-1 py-0.5 text-[#8f979d]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <kbd className="rounded border border-[#2b3137] bg-[#15191c] px-1 py-0.5 text-[#8f979d]">Tab</kbd> Filter Category
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-[#868e94]">
            {activeUnit && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[#8b9c84]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a]"></span>
                Unit: <span className="text-[#b8f34a]">{activeUnit.name}</span>
              </span>
            )}
            <span>
              {query.trim() === ''
                ? `${filteredRecentSearches.length} recent`
                : `${filteredItems.length} ${filteredItems.length === 1 ? 'match' : 'matches'}`}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
