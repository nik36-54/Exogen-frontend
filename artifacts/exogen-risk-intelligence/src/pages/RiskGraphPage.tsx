import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  Filter,
  GitBranch,
  Layers,
  Maximize2,
  Minimize2,
  Network,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  businessUnitsList,
  primaryFedTransmissionGraph,
  riskRelationshipsList,
  riskSignalsList,
} from '@/data/risk-intelligence-data';
import type { TransmissionEdge, TransmissionNode } from '@/types/risk-intelligence';

export default function RiskGraphPage() {
  const [, setLocation] = useLocation();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-event');
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [traceMode, setTraceMode] = useState<'ALL' | 'UPSTREAM' | 'DOWNSTREAM'>('ALL');
  const [focusFilter, setFocusFilter] = useState<'ALL' | 'JPMC' | 'COMM_BANK' | 'INT_RATE'>('ALL');
  const [isWatched, setIsWatched] = useState(true);

  const nodes = primaryFedTransmissionGraph.nodes;
  const edges = primaryFedTransmissionGraph.edges;

  // Filter nodes based on type, query, and focus
  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (nodeTypeFilter !== 'ALL' && n.type !== nodeTypeFilter) return false;
      if (focusFilter === 'COMM_BANK' && n.type === 'BUSINESS_UNIT' && !n.label.includes('Commercial')) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      return (
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [nodes, nodeTypeFilter, focusFilter, searchQuery]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Connected nodes based on trace mode (Upstream / Downstream / Direct)
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const set = new Set<string>([selectedNodeId]);

    if (traceMode === 'ALL' || traceMode === 'DOWNSTREAM') {
      edges.forEach((e) => {
        if (e.source === selectedNodeId) set.add(e.target);
      });
    }

    if (traceMode === 'ALL' || traceMode === 'UPSTREAM') {
      edges.forEach((e) => {
        if (e.target === selectedNodeId) set.add(e.source);
      });
    }

    return set;
  }, [selectedNodeId, edges, traceMode]);

  const getNodeColor = (type: TransmissionNode['type'], isConnected: boolean) => {
    if (!isConnected && selectedNodeId) {
      return 'border-[#1f2428] bg-[#0c0e10] text-[#555f65] opacity-30';
    }
    switch (type) {
      case 'EVENT':
        return 'border-[#b8f34a]/80 bg-[#162015] text-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.12)]';
      case 'MACRO_VARIABLE':
        return 'border-[#718da0]/70 bg-[#12191e] text-[#93b3ca]';
      case 'MARKET_VARIABLE':
        return 'border-[#8f75b2]/70 bg-[#191421] text-[#c0a8e0]';
      case 'ECONOMIC_MECHANISM':
      case 'FINANCIAL_MECHANISM':
        return 'border-[#425059] bg-[#12171a] text-[#b2c3cc]';
      case 'BUSINESS_UNIT':
        return 'border-[#918146]/70 bg-[#1a170f] text-[#edd58c]';
      case 'EXPOSURE':
        return 'border-[#b8f34a]/90 bg-[#1c2419] text-[#b8f34a] font-semibold';
      default:
        return 'border-[#2d363c] bg-[#111417] text-[#c9d0cc]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back navigation & controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setLocation('/risk')}
          className="flex items-center gap-1.5 text-[11px] text-[#869197] hover:text-[#dce1dc] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Risk Intelligence</span>
        </button>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="mono text-[#717b81]">15 Nodes · 15 Causal Edges</span>
          <span className="text-[#3b4348]">·</span>
          <span className="mono rounded bg-[#172016] px-2 py-0.5 text-[#b8f34a]">
            JPMorgan Model Perimeter
          </span>
        </div>
      </div>

      {/* Header (Section 33) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network size={16} className="text-[#b8f34a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
              INTERACTIVE PROPAGATION GRAPH
            </span>
          </div>
          <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
            Risk Graph
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
            Explore relationships between external events, risk categories, transmission mechanisms, business units, and exposure.
          </p>
        </div>

        {/* Trace Mode & Focus Filter Controls (Section 26 & 27) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Focus Mode */}
          <div className="flex items-center gap-1 rounded border border-[#2b3337] bg-[#121618] p-1 text-[10px]">
            <span className="px-2 text-[#687379]">Focus:</span>
            <button
              type="button"
              onClick={() => setFocusFilter('ALL')}
              className={`rounded px-2.5 py-1 transition-colors ${
                focusFilter === 'ALL'
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#879398] hover:text-[#edf0ec]'
              }`}
            >
              All Perimeter
            </button>
            <button
              type="button"
              onClick={() => setFocusFilter('COMM_BANK')}
              className={`rounded px-2.5 py-1 transition-colors ${
                focusFilter === 'COMM_BANK'
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#879398] hover:text-[#edf0ec]'
              }`}
            >
              Commercial Banking Focus
            </button>
          </div>

          {/* Trace Mode */}
          <div className="flex items-center gap-1 rounded border border-[#2b3337] bg-[#121618] p-1 text-[10px]">
            <span className="px-2 text-[#687379]">Trace:</span>
            <button
              type="button"
              onClick={() => setTraceMode('ALL')}
              className={`rounded px-2.5 py-1 transition-colors ${
                traceMode === 'ALL'
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#879398] hover:text-[#edf0ec]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTraceMode('UPSTREAM')}
              className={`rounded px-2.5 py-1 transition-colors ${
                traceMode === 'UPSTREAM'
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#879398] hover:text-[#edf0ec]'
              }`}
            >
              Trace Upstream
            </button>
            <button
              type="button"
              onClick={() => setTraceMode('DOWNSTREAM')}
              className={`rounded px-2.5 py-1 transition-colors ${
                traceMode === 'DOWNSTREAM'
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#879398] hover:text-[#edf0ec]'
              }`}
            >
              Trace Downstream
            </button>
          </div>
        </div>
      </div>

      {/* Graph Filter Bar & Zoom Controls (Section 34) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#23292d] bg-[#111417] p-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#6c777d]">Filter Node Type:</span>
          {['ALL', 'EVENT', 'MACRO_VARIABLE', 'ECONOMIC_MECHANISM', 'BUSINESS_UNIT', 'EXPOSURE'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setNodeTypeFilter(t)}
              className={`rounded px-2.5 py-1 text-[10px] transition-colors ${
                nodeTypeFilter === t
                  ? 'bg-[#1b221a] text-[#b8f34a] font-semibold'
                  : 'text-[#828c91] hover:text-[#edf0ec]'
              }`}
            >
              {t === 'ALL' ? 'All Types' : t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#687278]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graph nodes..."
              className="w-full rounded border border-[#262c30] bg-[#0c0f11] py-1 pl-7 pr-3 text-[10px] text-[#edf0ec] placeholder-[#606a70] outline-none"
            />
          </div>

          <div className="flex items-center rounded border border-[#2b3337] bg-[#0c0f11] p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1 text-[#869197] hover:text-[#edf0ec]"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="mono px-1.5 text-[9px] text-[#869197]">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 text-[#869197] hover:text-[#edf0ec]"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomLevel(1);
                setSelectedNodeId('node-event');
              }}
              className="p-1 text-[#869197] hover:text-[#edf0ec]"
              title="Reset View"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas + Detail Panel Grid (Section 34 & 35) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Graph Canvas Visualizer */}
        <div className="relative min-h-[560px] overflow-auto rounded-[8px] border border-[#242b2f] bg-[#090c0e] p-6">
          <div
            className="transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Visual multi-column layout with connecting SVG curves */}
            <div className="grid grid-cols-5 gap-6 min-w-[880px]">
              {/* Column 1: Event */}
              <div className="space-y-4">
                <span className="mono text-[8px] font-semibold text-[#6d777d] tracking-[.14em]">01. EVENT</span>
                {nodes
                  .filter((n) => n.type === 'EVENT')
                  .map((n) => {
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className={`cursor-pointer rounded-[6px] border p-3.5 transition-all ${
                          isSelected ? 'ring-2 ring-[#b8f34a]' : ''
                        } ${getNodeColor(n.type, isConnected)}`}
                      >
                        {n.id === 'node-event' && (
                          <div className="mb-1.5 inline-flex items-center gap-1 rounded bg-[#ff5c5c]/20 px-1.5 py-0.2 text-[8px] font-mono font-bold text-[#ff5c5c]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c5c] animate-pulse" />
                            ACTIVE WARNING · HIGH
                          </div>
                        )}
                        <div className="text-[12px] font-semibold leading-tight">{n.label}</div>
                        <div className="mono mt-1 text-[10px] text-[#b8f34a]">{n.sublabel}</div>
                      </div>
                    );
                  })}
              </div>

              {/* Column 2: Macro & Market Variables */}
              <div className="space-y-4">
                <span className="mono text-[8px] font-semibold text-[#6d777d] tracking-[.14em]">02. MACRO & RATES</span>
                {nodes
                  .filter((n) => n.type === 'MACRO_VARIABLE' || n.type === 'MARKET_VARIABLE')
                  .map((n) => {
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                          isSelected ? 'ring-2 ring-[#b8f34a]' : ''
                        } ${getNodeColor(n.type, isConnected)}`}
                      >
                        <div className="text-[11px] font-semibold">{n.label}</div>
                        <div className="mt-0.5 text-[9px] text-[#869298]">{n.sublabel}</div>
                      </div>
                    );
                  })}
              </div>

              {/* Column 3: Mechanisms */}
              <div className="space-y-4">
                <span className="mono text-[8px] font-semibold text-[#6d777d] tracking-[.14em]">03. MECHANISMS</span>
                {nodes
                  .filter((n) => n.type === 'ECONOMIC_MECHANISM' || n.type === 'FINANCIAL_MECHANISM')
                  .map((n) => {
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                          isSelected ? 'ring-2 ring-[#b8f34a]' : ''
                        } ${getNodeColor(n.type, isConnected)}`}
                      >
                        <div className="text-[11px] font-semibold">{n.label}</div>
                        <div className="mt-0.5 text-[9px] text-[#869298]">{n.sublabel}</div>
                      </div>
                    );
                  })}
              </div>

              {/* Column 4: Business Units */}
              <div className="space-y-4">
                <span className="mono text-[8px] font-semibold text-[#6d777d] tracking-[.14em]">04. BUSINESS UNITS</span>
                {nodes
                  .filter((n) => n.type === 'BUSINESS_UNIT')
                  .map((n) => {
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                          isSelected ? 'ring-2 ring-[#b8f34a]' : ''
                        } ${getNodeColor(n.type, isConnected)}`}
                      >
                        <div className="text-[11px] font-semibold">{n.label}</div>
                        <div className="mt-0.5 text-[9px] text-[#869298]">{n.sublabel}</div>
                      </div>
                    );
                  })}
              </div>

              {/* Column 5: Modeled Exposure */}
              <div className="space-y-4">
                <span className="mono text-[8px] font-semibold text-[#6d777d] tracking-[.14em]">05. EXPOSURE</span>
                {nodes
                  .filter((n) => n.type === 'EXPOSURE')
                  .map((n) => {
                    const isSelected = selectedNodeId === n.id;
                    const isConnected = connectedNodeIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNodeId(n.id)}
                        className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                          isSelected ? 'ring-2 ring-[#b8f34a]' : ''
                        } ${getNodeColor(n.type, isConnected)}`}
                      >
                        <div className="mono text-[13px] font-semibold">{n.label}</div>
                        <div className="mt-0.5 text-[9px] text-[#87ab74]">{n.sublabel}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Panel (Section 35) */}
        <div className="flex flex-col justify-between rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 text-[11px]">
          <div>
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <span className="mono text-[9px] font-semibold tracking-[.14em] text-[#b8f34a]">
                GRAPH NODE DETAIL
              </span>
              <span className="mono text-[10px] text-[#6d777d]">{selectedNode.type}</span>
            </div>

            <div className="mt-4">
              <h3 className="text-[16px] font-medium text-[#edf0eb]">{selectedNode.label}</h3>
              {selectedNode.sublabel && (
                <div className="mono mt-1 text-[11px] text-[#b8f34a]">{selectedNode.sublabel}</div>
              )}
              <p className="mt-2 text-[11px] leading-relaxed text-[#939ea3]">
                {selectedNode.description}
              </p>
            </div>

            {/* Entity-specific metrics */}
            {selectedNode.type === 'EVENT' && (
              <div className="mt-4 space-y-2 rounded border border-[#21272b] bg-[#0c0f11] p-3">
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Consensus Probability:</span>
                  <span className="mono text-[#b8f34a]">66.1% (+24.1pp)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Composite Risk Score:</span>
                  <span className="mono font-bold text-[#b8f34a]">78 / 100 (HIGH)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Modeled Firm Exposure:</span>
                  <span className="mono font-semibold text-[#f5f5f2]">$27.8M</span>
                </div>
                <div className="flex justify-between border-t border-[#1b2023] pt-1.5">
                  <span className="text-[#6d777d]">Potential Downside Impact:</span>
                  <span className="mono font-bold text-[#b8f34a]">$18.4M</span>
                </div>
                <div className="flex justify-between border-t border-[#1b2023] pt-1.5 text-[10px]">
                  <span className="text-[#ff5c5c] font-semibold">Active Early Warning:</span>
                  <span className="mono text-[#ff5c5c]">HIGH (12m ago)</span>
                </div>
              </div>
            )}

            {selectedNode.type === 'BUSINESS_UNIT' && (
              <div className="mt-4 space-y-2 rounded border border-[#21272b] bg-[#0c0f11] p-3">
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Division:</span>
                  <span className="font-medium text-[#edf0eb]">Commercial & Investment Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d777d]">Active Catalysts:</span>
                  <span className="mono text-[#edf0eb]">8 Risk Events</span>
                </div>
                <div className="flex justify-between border-t border-[#1b2023] pt-1.5">
                  <span className="text-[#6d777d]">Modeled Base Exposure:</span>
                  <span className="mono font-semibold text-[#b8f34a]">$24.6M</span>
                </div>
              </div>
            )}

            {/* Connected Edges */}
            <div className="mt-5">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6d777d]">
                CONNECTED GRAPH PATHS
              </span>
              <div className="mt-2 space-y-1.5 font-mono text-[10px]">
                {edges
                  .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between rounded bg-[#0c0f11] p-2 text-[#9fa9ad]"
                    >
                      <span>{e.relationship}</span>
                      <span className="text-[#b8f34a]">{e.confidencePct}% conf</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#1f2427] pt-3 space-y-2">
            {selectedNode.type === 'EVENT' && (
              <>
                <button
                  type="button"
                  onClick={() => setLocation('/early-warnings/WARN-FED-RATE-CUT')}
                  className="w-full flex items-center justify-center gap-1.5 rounded border border-[#ff5c5c]/40 bg-[#ff5c5c]/10 py-1.5 text-[11px] font-semibold text-[#ff5c5c] hover:bg-[#ff5c5c]/20"
                >
                  <AlertTriangle size={12} />
                  <span>Investigate Early Warning</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('/risk/scores/RS-FED-RATE-CUT')}
                  className="w-full flex items-center justify-center gap-1 rounded bg-[#172016] py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#1e2a1d]"
                >
                  <span>View Risk Score (78)</span>
                  <ArrowRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('/risk/propagation/PROP-FED-RATE-CUT')}
                  className="w-full flex items-center justify-center gap-1 rounded border border-[#2b3337] py-1.5 text-[11px] text-[#939da2] hover:bg-[#161a1d] hover:text-[#edf0ec]"
                >
                  <GitBranch size={12} />
                  <span>View Propagation Timeline</span>
                </button>
              </>
            )}
            {selectedNode.businessUnitId && (
              <button
                type="button"
                onClick={() => setLocation(`/exposure/business-unit/${selectedNode.businessUnitId}`)}
                className="w-full flex items-center justify-center gap-1 rounded bg-[#172016] py-2 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#1e2a1d]"
              >
                <span>Inspect Business Unit Exposure</span>
                <ArrowRight size={12} />
              </button>
            )}
            {selectedNode.type !== 'EVENT' && !selectedNode.businessUnitId && (
              <button
                type="button"
                onClick={() => setLocation('/risk/propagation')}
                className="w-full rounded border border-[#2b3337] py-2 text-[11px] text-[#939da2] hover:bg-[#161a1d] hover:text-[#edf0ec]"
              >
                View in Transmission Path
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
