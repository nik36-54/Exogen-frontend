import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Filter,
  Layers,
  Network,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { TransmissionEdge, TransmissionGraphData, TransmissionNode } from '@/types/risk-intelligence';
import { TransmissionEdgeDrawer } from './TransmissionEdgeDrawer';

interface Props {
  graphData: TransmissionGraphData;
  onSelectBusinessUnit?: (unitId: string) => void;
}

export function TransmissionGraphVisualizer({ graphData, onSelectBusinessUnit }: Props) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<TransmissionEdge | null>(null);
  const [pathFilter, setPathFilter] = useState<'ALL' | 'HIGHEST_CONFIDENCE' | 'COMMERCIAL' | 'MARKETS'>('ALL');
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>('ALL');

  const selectedNode = graphData.nodes.find((n) => n.id === selectedNodeId);

  // Group nodes by visual hierarchy columns
  const columns = useMemo(() => {
    const colMap: Record<string, TransmissionNode[]> = {
      event: graphData.nodes.filter((n) => n.type === 'EVENT'),
      macro: graphData.nodes.filter((n) => n.type === 'MACRO_VARIABLE' || n.type === 'MARKET_VARIABLE'),
      mechanism: graphData.nodes.filter((n) => n.type === 'ECONOMIC_MECHANISM' || n.type === 'FINANCIAL_MECHANISM'),
      unit: graphData.nodes.filter((n) => n.type === 'BUSINESS_UNIT'),
      exposure: graphData.nodes.filter((n) => n.type === 'EXPOSURE'),
    };
    return colMap;
  }, [graphData.nodes]);

  const getNodeColor = (type: TransmissionNode['type']) => {
    switch (type) {
      case 'EVENT':
        return 'border-[#b8f34a]/60 bg-[#162015] text-[#b8f34a]';
      case 'MACRO_VARIABLE':
        return 'border-[#718da0]/50 bg-[#12191e] text-[#93b3ca]';
      case 'MARKET_VARIABLE':
        return 'border-[#8f75b2]/50 bg-[#191421] text-[#c0a8e0]';
      case 'ECONOMIC_MECHANISM':
      case 'FINANCIAL_MECHANISM':
        return 'border-[#425059] bg-[#12171a] text-[#b2c3cc]';
      case 'BUSINESS_UNIT':
        return 'border-[#918146]/50 bg-[#1a170f] text-[#edd58c]';
      case 'EXPOSURE':
        return 'border-[#b8f34a]/80 bg-[#1c2419] text-[#b8f34a]';
      default:
        return 'border-[#2d363c] bg-[#111417] text-[#c9d0cc]';
    }
  };

  const getSourceNode = (id: string) => graphData.nodes.find((n) => n.id === id);
  const getTargetNode = (id: string) => graphData.nodes.find((n) => n.id === id);

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#20262a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network size={15} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              ECONOMIC TRANSMISSION TOPOLOGY
            </span>
          </div>
          <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
            Multi-Path Risk Propagation Visualizer
          </h2>
          <p className="mt-1 text-[12px] text-[#8e989d]">
            Causal propagation from external rate trigger through pricing mechanics into distinct JPMorgan Chase business units.
          </p>
        </div>

        {/* Path Explorer Filter Buttons (Section 36) */}
        <div className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181a] p-1 text-[10px]">
          <span className="px-2 text-[#687379]">Explore path:</span>
          <button
            type="button"
            onClick={() => setPathFilter('ALL')}
            className={`rounded px-2.5 py-1 transition-colors ${
              pathFilter === 'ALL'
                ? 'bg-[#1b2419] text-[#b8f34a] font-semibold'
                : 'text-[#879398] hover:text-[#edf0ec]'
            }`}
          >
            All Paths
          </button>
          <button
            type="button"
            onClick={() => setPathFilter('HIGHEST_CONFIDENCE')}
            className={`rounded px-2.5 py-1 transition-colors ${
              pathFilter === 'HIGHEST_CONFIDENCE'
                ? 'bg-[#1b2419] text-[#b8f34a] font-semibold'
                : 'text-[#879398] hover:text-[#edf0ec]'
            }`}
          >
            Highest Confidence (Commercial)
          </button>
          <button
            type="button"
            onClick={() => setPathFilter('MARKETS')}
            className={`rounded px-2.5 py-1 transition-colors ${
              pathFilter === 'MARKETS'
                ? 'bg-[#1b2419] text-[#b8f34a] font-semibold'
                : 'text-[#879398] hover:text-[#edf0ec]'
            }`}
          >
            Markets Path
          </button>
        </div>
      </div>

      {/* Structured Multi-Column Flow Graph */}
      <div className="mt-6 overflow-x-auto pb-4">
        <div className="grid min-w-[960px] grid-cols-5 gap-4">
          {/* Column 1: Event */}
          <div className="space-y-3">
            <div className="border-b border-[#1f2528] pb-1.5 text-[9px] font-semibold tracking-[.12em] text-[#6d787e]">
              01. EXTERNAL EVENT
            </div>
            {columns.event.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                  selectedNodeId === n.id
                    ? 'ring-1 ring-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.1)]'
                    : 'hover:border-[#434f56]'
                } ${getNodeColor(n.type)}`}
              >
                <div className="text-[12px] font-semibold">{n.label}</div>
                <div className="mono mt-1 text-[10px] text-[#b8f34a]">{n.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Column 2: Macro / Market Variables */}
          <div className="space-y-3">
            <div className="border-b border-[#1f2528] pb-1.5 text-[9px] font-semibold tracking-[.12em] text-[#6d787e]">
              02. MACRO & MARKET
            </div>
            {columns.macro.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                  selectedNodeId === n.id
                    ? 'ring-1 ring-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.1)]'
                    : 'hover:border-[#434f56]'
                } ${getNodeColor(n.type)}`}
              >
                <div className="text-[11px] font-semibold">{n.label}</div>
                <div className="mt-0.5 text-[9px] text-[#8e9aa1]">{n.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Column 3: Economic & Financial Mechanisms */}
          <div className="space-y-3">
            <div className="border-b border-[#1f2528] pb-1.5 text-[9px] font-semibold tracking-[.12em] text-[#6d787e]">
              03. MECHANISMS
            </div>
            {columns.mechanism.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                  selectedNodeId === n.id
                    ? 'ring-1 ring-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.1)]'
                    : 'hover:border-[#434f56]'
                } ${getNodeColor(n.type)}`}
              >
                <div className="text-[11px] font-semibold">{n.label}</div>
                <div className="mt-0.5 text-[9px] text-[#8e9aa1]">{n.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Column 4: Business Units */}
          <div className="space-y-3">
            <div className="border-b border-[#1f2528] pb-1.5 text-[9px] font-semibold tracking-[.12em] text-[#6d787e]">
              04. BUSINESS UNITS
            </div>
            {columns.unit.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setSelectedNodeId(n.id);
                  if (n.businessUnitId && onSelectBusinessUnit) {
                    onSelectBusinessUnit(n.businessUnitId);
                  }
                }}
                className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                  selectedNodeId === n.id
                    ? 'ring-1 ring-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.1)]'
                    : 'hover:border-[#434f56]'
                } ${getNodeColor(n.type)}`}
              >
                <div className="text-[11px] font-semibold">{n.label}</div>
                <div className="mt-0.5 text-[9px] text-[#9ba6ad]">{n.sublabel}</div>
              </div>
            ))}
          </div>

          {/* Column 5: Modeled Exposure */}
          <div className="space-y-3">
            <div className="border-b border-[#1f2528] pb-1.5 text-[9px] font-semibold tracking-[.12em] text-[#6d787e]">
              05. MODELED EXPOSURE
            </div>
            {columns.exposure.map((n) => (
              <div
                key={n.id}
                onClick={() => setSelectedNodeId(n.id)}
                className={`cursor-pointer rounded-[6px] border p-3 transition-all ${
                  selectedNodeId === n.id
                    ? 'ring-1 ring-[#b8f34a] shadow-[0_0_12px_rgba(184,243,74,0.1)]'
                    : 'hover:border-[#434f56]'
                } ${getNodeColor(n.type)}`}
              >
                <div className="mono text-[13px] font-semibold">{n.label}</div>
                <div className="mt-0.5 text-[9px] text-[#8ba67e]">{n.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Node Summary or Edge Callouts */}
      <div className="mt-4 rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1d2225] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="mono text-[9px] font-semibold uppercase tracking-[.12em] text-[#b8f34a]">
              NODE INSPECTOR
            </span>
            <span className="text-[#3a4348]">/</span>
            <span className="font-semibold text-[#edf1ec]">
              {selectedNode ? selectedNode.label : 'Select any node or edge to inspect mechanics'}
            </span>
            {selectedNode && (
              <span className="mono text-[9px] text-[#717b81]">({selectedNode.type})</span>
            )}
          </div>

          {selectedNode?.businessUnitId && (
            <button
              type="button"
              onClick={() => onSelectBusinessUnit?.(selectedNode.businessUnitId!)}
              className="text-[10px] text-[#b8f34a] hover:underline"
            >
              Inspect Business Unit detail →
            </button>
          )}
        </div>

        <p className="mt-2.5 text-[11px] leading-relaxed text-[#96a0a5]">
          {selectedNode
            ? selectedNode.description
            : 'Every node in this topological representation captures a transition state between external macroeconomic announcements and firm balance-sheet sensitivity.'}
        </p>

        {/* Edge list for selected node */}
        <div className="mt-3 border-t border-[#1a1f22] pt-2.5">
          <span className="text-[9px] font-semibold tracking-[.1em] text-[#657076]">
            INTERCONNECTED TRANSMISSION EDGES (CLICK TO INSPECT)
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {graphData.edges
              .filter(
                (e) =>
                  !selectedNodeId ||
                  e.source === selectedNodeId ||
                  e.target === selectedNodeId
              )
              .slice(0, 6)
              .map((edge) => {
                const sNode = getSourceNode(edge.source);
                const tNode = getTargetNode(edge.target);
                return (
                  <button
                    key={edge.id}
                    type="button"
                    onClick={() => setSelectedEdge(edge)}
                    className="flex items-center gap-1.5 rounded border border-[#23292d] bg-[#14181a] px-2.5 py-1 text-[10px] text-[#c8d0cb] hover:border-[#3d4950] hover:text-[#edf0ec]"
                  >
                    <span>{sNode?.label}</span>
                    <span className="mono text-[8px] text-[#b8f34a]">
                      [{edge.relationship}]
                    </span>
                    <span>{tNode?.label}</span>
                    <span className="mono text-[9px] text-[#78848a]">
                      ({edge.confidencePct}%)
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Edge Inspector Drawer */}
      <TransmissionEdgeDrawer
        isOpen={!!selectedEdge}
        onClose={() => setSelectedEdge(null)}
        edge={selectedEdge}
        sourceLabel={selectedEdge ? getSourceNode(selectedEdge.source)?.label : undefined}
        targetLabel={selectedEdge ? getTargetNode(selectedEdge.target)?.label : undefined}
      />
    </article>
  );
}
