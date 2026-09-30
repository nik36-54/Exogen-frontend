import { useState } from 'react';
import { Briefcase, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { BusinessUnitImpact, RiskCategoryImpact } from '@/types/quantitative-intelligence';

interface Props {
  byBusinessUnit: BusinessUnitImpact[];
  byRiskCategory: RiskCategoryImpact[];
  onSelectUnit?: (unitId: string) => void;
}

export function ImpactDecompositionView({ byBusinessUnit, byRiskCategory, onSelectUnit }: Props) {
  const [tab, setTab] = useState<'BU' | 'RISK'>('BU');

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            MULTI-DIMENSIONAL DECOMPOSITION
          </span>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Modeled Impact Allocation
          </h3>
        </div>

        {/* Toggle Pill */}
        <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs">
          <button
            onClick={() => setTab('BU')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition ${
              tab === 'BU' ? 'bg-[#171a1d] text-[#f5f5f2] shadow-xs' : 'text-[#92989e] hover:text-[#f5f5f2]'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Business Unit
          </button>
          <button
            onClick={() => setTab('RISK')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition ${
              tab === 'RISK' ? 'bg-[#171a1d] text-[#f5f5f2] shadow-xs' : 'text-[#92989e] hover:text-[#f5f5f2]'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Risk Category
          </button>
        </div>
      </div>

      {tab === 'BU' ? (
        <div className="mt-5 space-y-3">
          <div className="text-[11px] text-[#92989e] mb-2">
            Directional impact varies by division balance sheet profile (positive/negative/mixed):
          </div>

          {byBusinessUnit.map((bu) => {
            const isNegative = bu.direction === 'NEGATIVE' || bu.modeledImpactUsdM < 0;
            const isPositive = bu.direction === 'POSITIVE' || bu.modeledImpactUsdM > 0;
            const isMixed = bu.direction === 'MIXED';

            return (
              <div
                key={bu.unitId}
                onClick={() => onSelectUnit && onSelectUnit(bu.unitId)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 transition hover:border-[#3b4440] cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a]">
                      {bu.unitName}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                        isNegative
                          ? 'bg-[#ff5c5c]/10 text-[#ff5c5c]'
                          : isPositive
                          ? 'bg-[#b8f34a]/10 text-[#b8f34a]'
                          : 'bg-[#7c8cff]/10 text-[#7c8cff]'
                      }`}
                    >
                      {bu.direction}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-[#92989e]">
                    {bu.note}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right shrink-0">
                  <div>
                    <div className="text-[10px] font-mono text-[#656b70]">MODELED EXPOSURE</div>
                    <div className="text-xs font-mono font-medium text-[#f5f5f2]">
                      ${bu.exposureUsdM.toFixed(1)}M
                    </div>
                  </div>

                  <div className="w-24">
                    <div className="text-[10px] font-mono text-[#656b70]">MODELED IMPACT</div>
                    <div
                      className={`text-sm font-mono font-bold flex items-center justify-end gap-1 ${
                        isNegative
                          ? 'text-[#ff5c5c]'
                          : isPositive
                          ? 'text-[#b8f34a]'
                          : 'text-[#7c8cff]'
                      }`}
                    >
                      {isNegative ? (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      ) : isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <Minus className="h-3.5 w-3.5" />
                      )}
                      {bu.direction === 'MIXED' ? '±' : ''}${Math.abs(bu.modeledImpactUsdM).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <div className="text-[11px] text-[#92989e] mb-2">
            Attribution across overarching financial risk classifications:
          </div>

          {byRiskCategory.map((rc) => (
            <div
              key={rc.riskCategory}
              className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[#f5f5f2]">
                <span>{rc.riskCategory}</span>
                <span className="font-mono text-[#b8f34a]">${rc.modeledImpactUsdM.toFixed(1)}M ({rc.sharePct}%)</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#0a0a0b] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#b8f34a]"
                  style={{ width: `${rc.sharePct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
