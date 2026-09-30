import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Bell,
  Sliders,
  Plus,
  Check,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  alertRulesMock,
  triggeredAlertsMock,
} from '@/data/monitoring-intelligence-data';
import { AlertBuilderDrawer } from '@/components/monitoring/AlertBuilderDrawer';
import type { AlertRule } from '@/types/monitoring-intelligence';

export default function AlertsPage() {
  const [, setLocation] = useLocation();
  const [rules, setRules] = useState<AlertRule[]>(alertRulesMock);
  const [triggeredAlerts, setTriggeredAlerts] = useState(triggeredAlertsMock);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>('GRP-FED-EASING');

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCreateRule = (newRule: Partial<AlertRule>) => {
    const created: AlertRule = {
      id: `ALERT-0${rules.length + 1}`,
      name: newRule.name || 'Custom Rule',
      entityType: (newRule.entityType as any) || 'RISK',
      entityId: 'RSK-CUSTOM',
      entityName: newRule.entityName || 'Monitored Entity',
      metric: newRule.metric || 'risk_score',
      operator: newRule.operator || 'gt',
      threshold: newRule.threshold || 75,
      thresholdLabel: newRule.thresholdLabel || 'Score > 75',
      additionalCondition: newRule.additionalCondition,
      notificationChannel: newRule.notificationChannel || 'IN_APP',
      frequency: newRule.frequency || 'IMMEDIATELY',
      enabled: true,
      createdAt: 'Just now',
      triggerCount: 0,
    };
    setRules((prev) => [created, ...prev]);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              ALERT DISPATCH & SENTINEL · LAYER 06
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              CUSTOM RULES
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Alerts
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Rules and notifications generated from user-configured conditions across market probability, risk scores, and dollar consequences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBuilderOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#a6e03b] transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Alert Rule
          </button>
        </div>
      </div>

      {/* Conceptual Distinction Banner (Section 34) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-[#b8f34a]">
            <Sparkles className="h-4 w-4" />
            Early Warning (System-Generated)
          </div>
          <p className="text-[11px] text-[#92989e] leading-relaxed">
            Autonomous material change detection based on algorithmic cross-venue data synthesis, causal propagation, and corporate exposure models.
          </p>
        </div>

        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 font-semibold text-[#7c8cff]">
            <Bell className="h-4 w-4" />
            Alert (User-Configured Condition)
          </div>
          <p className="text-[11px] text-[#92989e] leading-relaxed">
            Personalized rules that notify you immediately when specific entities exceed custom risk appetite thresholds or volatility bounds.
          </p>
        </div>
      </div>

      {/* Deduplicated Recent Triggers (Section 39 & 40) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              CORRELATED INCIDENTS
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Triggered Alert Notifications (Deduplicated)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#656b70]">PREVENTS ALERT FATIGUE</span>
        </div>

        {/* Grouped Alert Card */}
        <div className="rounded-lg border border-[#b8f34a]/40 bg-[#0a0a0b] p-4 text-xs space-y-3">
          <div
            onClick={() =>
              setExpandedGroupId(
                expandedGroupId === 'GRP-FED-EASING' ? null : 'GRP-FED-EASING'
              )
            }
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#b8f34a] animate-pulse" />
              <div>
                <span className="font-bold text-sm text-[#f5f5f2]">
                  1 Underlying Change: Federal Reserve Rate Cut
                </span>
                <span className="ml-2 rounded bg-[#b8f34a]/10 px-2 py-0.5 text-[10px] font-mono text-[#b8f34a]">
                  4 DOWNSTREAM TRIGGERS GROUPED
                </span>
              </div>
            </div>

            {expandedGroupId === 'GRP-FED-EASING' ? (
              <ChevronUp className="h-4 w-4 text-[#92989e]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#92989e]" />
            )}
          </div>

          <p className="text-[11px] text-[#92989e] leading-relaxed">
            Market consensus probability accelerated by +24.1pp at 08:42 UTC. Rather than issuing disparate alerts, Exogen correlated the probability surge and resulting risk score breach into a unified incident.
          </p>

          {expandedGroupId === 'GRP-FED-EASING' && (
            <div className="space-y-2 border-t border-[#1e2225] pt-3">
              {triggeredAlerts
                .filter((a) => a.deduplicationGroupId === 'GRP-FED-EASING')
                .map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => setLocation('/early-warnings/WARN-FED-RATE-CUT')}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded bg-[#171a1d] p-3 border border-[#24282c] hover:border-[#3b4440] cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#f5f5f2]">{alt.ruleName}</span>
                        <span className="text-[10px] font-mono text-[#ff5c5c] font-bold">
                          {alt.changeDelta}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#92989e] mt-0.5">{alt.reason}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-[10px] text-[#656b70]">{alt.triggeredAt}</div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#b8f34a] hover:underline mt-1">
                        Investigate <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Other standalone alerts */}
        <div className="space-y-2">
          {triggeredAlerts
            .filter((a) => !a.deduplicationGroupId)
            .map((alt) => (
              <div
                key={alt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f5f5f2]">{alt.ruleName}</span>
                    <span className="rounded bg-[#0a0a0b] px-1.5 py-0.2 text-[9px] font-mono text-[#7c8cff] border border-[#24282c]">
                      {alt.entityName}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#92989e] mt-1">{alt.reason}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-[10px] text-[#656b70]">{alt.triggeredAt}</div>
                  <div className="font-mono text-xs font-bold text-[#b8f34a] mt-0.5">{alt.currentValue}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Configured Alert Rules Table (Section 35) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              RULE SPECIFICATIONS
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Configured Alert Sentinels
            </h2>
          </div>
          <span className="text-xs font-mono text-[#656b70]">{rules.length} ACTIVE RULES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#24282c] text-[10px] font-mono uppercase text-[#92989e]">
                <th className="py-2.5 px-3">Rule Name</th>
                <th className="py-2.5 px-3">Monitored Target</th>
                <th className="py-2.5 px-3">Condition & Threshold</th>
                <th className="py-2.5 px-3">Frequency</th>
                <th className="py-2.5 px-3 text-right">Last Triggered</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2225]">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#171a1d] transition">
                  <td className="py-3 px-3 font-semibold text-[#f5f5f2]">
                    {rule.name}
                    <div className="text-[10px] font-mono text-[#656b70]">{rule.id}</div>
                  </td>
                  <td className="py-3 px-3 text-[#92989e]">{rule.entityName}</td>
                  <td className="py-3 px-3 font-mono text-[#b8f34a]">
                    {rule.thresholdLabel}
                    {rule.additionalCondition && (
                      <div className="text-[10px] text-[#656b70]">{rule.additionalCondition}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#92989e]">{rule.frequency}</td>
                  <td className="py-3 px-3 text-right font-mono text-[#656b70]">
                    {rule.lastTriggeredAt || 'Never'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`rounded px-2.5 py-1 text-[10px] font-mono font-bold transition ${
                        rule.enabled
                          ? 'bg-[#b8f34a]/10 text-[#b8f34a] border border-[#b8f34a]/30'
                          : 'bg-[#171a1d] text-[#656b70] border border-[#24282c]'
                      }`}
                    >
                      {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Builder Drawer */}
      <AlertBuilderDrawer
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onSave={handleCreateRule}
      />
    </div>
  );
}
