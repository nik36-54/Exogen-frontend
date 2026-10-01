import { Network, ArrowRight, ShieldAlert, Sparkles, Building2, DollarSign } from 'lucide-react';
import type { ReplayTimestampTick } from '@/types/validation-intelligence';

interface Props {
  tick: ReplayTimestampTick;
}

export function ReplayMiniGraph({ tick }: Props) {
  const nodes = [
    {
      id: 'node-event',
      title: 'Canonical Event',
      subtitle: 'Fed 50bps Cut',
      icon: Sparkles,
      type: 'event',
    },
    {
      id: 'node-risk-interest',
      title: 'Direct Risk Factor',
      subtitle: 'Interest Rate Risk',
      icon: ShieldAlert,
      type: 'risk',
    },
    {
      id: 'node-bu-commercial',
      title: 'Business Unit A',
      subtitle: 'Commercial Banking',
      icon: Building2,
      type: 'bu',
    },
    {
      id: 'node-bu-cib',
      title: 'Business Unit B',
      subtitle: 'Corp & Invest Bank',
      icon: Building2,
      type: 'bu',
    },
    {
      id: 'node-exposure-nim',
      title: 'Balance Sheet Impact',
      subtitle: 'NIM Compression',
      icon: DollarSign,
      type: 'exposure',
    },
  ];

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-[#b8f34a]" />
          <h4 className="text-sm font-semibold text-[#f5f5f2]">
            Causal Graph Activation at {tick.label}
          </h4>
        </div>
        <div className="text-[10px] font-mono text-[#8d969b]">
          Active Nodes: {tick.graphNodesActive.length} / 5 · Active Edges: {tick.graphEdgesActive.length} / 4
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 p-2">
        {nodes.map((n, i) => {
          const isActive = tick.graphNodesActive.includes(n.id);
          const Icon = n.icon;

          return (
            <div key={n.id} className="flex items-center">
              <div
                className={`flex flex-col items-center p-3 rounded-lg border text-center transition-all duration-300 w-36 ${
                  isActive
                    ? 'border-[#b8f34a]/60 bg-[#162015] shadow-lg shadow-[#b8f34a]/5'
                    : 'border-[#24282c] bg-[#111416] opacity-40'
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-md mb-1.5 ${
                    isActive ? 'bg-[#b8f34a]/20 text-[#b8f34a]' : 'bg-[#1f2427] text-[#6c7479]'
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#8d969b]">
                  {n.title}
                </span>
                <span
                  className={`text-xs font-semibold mt-0.5 truncate max-w-full ${
                    isActive ? 'text-[#f5f5f2]' : 'text-[#6c7479]'
                  }`}
                >
                  {n.subtitle}
                </span>
                <span
                  className={`mt-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-[#1e2a1d] text-[#b8f34a] border border-[#b8f34a]/30'
                      : 'bg-[#171a1d] text-[#555d62]'
                  }`}
                >
                  {isActive ? 'ACTIVE' : 'DORMANT'}
                </span>
              </div>

              {i < nodes.length - 1 && (
                <div className="hidden lg:flex items-center px-2">
                  <ArrowRight
                    size={14}
                    className={`transition-colors ${
                      isActive ? 'text-[#b8f34a]' : 'text-[#2b3337]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
