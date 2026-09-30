import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Check,
  Clock,
  Layers,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  triggeredAlertsMock,
  earlyWarningsList,
  materialChangesList,
} from '@/data/monitoring-intelligence-data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenterDrawer({ isOpen, onClose }: Props) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'WARNINGS' | 'ALERTS' | 'CHANGES' | 'SYSTEM'>('WARNINGS');
  const [alerts, setAlerts] = useState(triggeredAlertsMock);
  const [expandedGroup, setExpandedGroup] = useState<string | null>('GRP-FED-EASING');

  if (!isOpen) return null;

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-md border-l border-[#24282c] bg-[#111416] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#24282c] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                RECENT MONITORING ACTIVITY
              </h2>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#b8f34a] px-1.5 py-0.2 text-[10px] font-mono font-bold text-[#0a0a0b]">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="mt-3 flex items-center gap-1 rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
            {(['WARNINGS', 'ALERTS', 'CHANGES', 'SYSTEM'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-md py-1 text-center transition ${
                  activeTab === tab
                    ? 'bg-[#171a1d] text-[#f5f5f2] font-semibold'
                    : 'text-[#92989e] hover:text-[#f5f5f2]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Early Warnings */}
          {activeTab === 'WARNINGS' && (
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#656b70]">
                <span>MATERIAL SYSTEM WARNINGS</span>
                <span>{earlyWarningsList.length} TOTAL</span>
              </div>

              {earlyWarningsList.slice(0, 4).map((warn) => (
                <div
                  key={warn.id}
                  onClick={() => {
                    onClose();
                    setLocation(`/early-warnings/${warn.id}`);
                  }}
                  className="group rounded-lg border border-[#24282c] bg-[#171a1d] p-3 transition hover:border-[#3b4440] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase ${
                        warn.severity === 'critical'
                          ? 'bg-[#ff5c5c]/10 text-[#ff5c5c]'
                          : warn.severity === 'high'
                          ? 'bg-[#b8f34a]/10 text-[#b8f34a]'
                          : 'bg-[#7c8cff]/10 text-[#7c8cff]'
                      }`}
                    >
                      {warn.severity}
                    </span>
                    <span className="text-[10px] font-mono text-[#656b70]">{warn.timeAgo}</span>
                  </div>

                  <div className="mt-1.5 text-xs font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a]">
                    {warn.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#92989e] line-clamp-2">
                    {warn.eventTitle} · Score {warn.riskScore} · {warn.businessUnitName}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  onClose();
                  setLocation('/early-warnings');
                }}
                className="w-full mt-2 flex items-center justify-center gap-1.5 rounded border border-[#24282c] bg-[#111416] py-2 text-xs font-medium text-[#b8f34a] hover:bg-[#171a1d]"
              >
                Open Early Warning Center ({earlyWarningsList.length}) →
              </button>
            </div>
          )}

          {/* Tab 2: User Alerts with Deduplication (Section 39 & 40) */}
          {activeTab === 'ALERTS' && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#656b70]">
                <span>DEDUPLICATED TRIGGER LOG</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[#b8f34a] hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              {/* Deduplication Group Card */}
              <div className="rounded-lg border border-[#b8f34a]/30 bg-[#0a0a0b] p-3 text-xs">
                <div
                  onClick={() =>
                    setExpandedGroup(expandedGroup === 'GRP-FED-EASING' ? null : 'GRP-FED-EASING')
                  }
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#b8f34a] animate-pulse" />
                    <span className="font-semibold text-[#f5f5f2]">
                      1 Material Change · 4 Downstream Effects
                    </span>
                  </div>
                  {expandedGroup === 'GRP-FED-EASING' ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[#92989e]" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[#92989e]" />
                  )}
                </div>

                <p className="mt-1 text-[11px] text-[#92989e]">
                  Origin: Federal Reserve rate cut easing surge triggered 2 rule thresholds simultaneously.
                </p>

                {expandedGroup === 'GRP-FED-EASING' && (
                  <div className="mt-3 space-y-2 border-t border-[#1e2225] pt-2">
                    {alerts
                      .filter((a) => a.deduplicationGroupId === 'GRP-FED-EASING')
                      .map((alt) => (
                        <div
                          key={alt.id}
                          className="rounded bg-[#171a1d] p-2 border border-[#24282c]"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-bold text-[#b8f34a]">{alt.ruleName}</span>
                            <span className="text-[#656b70]">{alt.triggeredAt}</span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#f5f5f2]">{alt.reason}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Other alerts */}
              {alerts
                .filter((a) => !a.deduplicationGroupId)
                .map((alt) => (
                  <div
                    key={alt.id}
                    className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-[#f5f5f2]">{alt.ruleName}</span>
                      <span className="text-[#656b70]">{alt.triggeredAt}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#92989e]">{alt.reason}</p>
                  </div>
                ))}

              <button
                onClick={() => {
                  onClose();
                  setLocation('/alerts');
                }}
                className="w-full mt-2 flex items-center justify-center gap-1.5 rounded border border-[#24282c] bg-[#111416] py-2 text-xs font-medium text-[#b8f34a] hover:bg-[#171a1d]"
              >
                Manage Alert Rules →
              </button>
            </div>
          )}

          {/* Tab 3: Changes */}
          {activeTab === 'CHANGES' && (
            <div className="mt-4 space-y-2.5">
              <div className="text-[10px] font-mono text-[#656b70]">
                DETECTION TELEMETRY LOG
              </div>

              {materialChangesList.map((chg) => (
                <div
                  key={chg.id}
                  onClick={() => {
                    onClose();
                    setLocation(chg.ctaPath);
                  }}
                  className="group rounded-lg border border-[#24282c] bg-[#171a1d] p-3 transition hover:border-[#3b4440] cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-[#b8f34a] font-bold">{chg.time}</span>
                    <span className="text-[#656b70]">{chg.magnitude}</span>
                  </div>
                  <div className="mt-1 font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a]">
                    {chg.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#92989e]">
                    {chg.eventTitle} ({chg.oldValue} → {chg.newValue})
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: System */}
          {activeTab === 'SYSTEM' && (
            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#b8f34a]">
                  ENGINE HEARTBEAT
                </div>
                <div className="flex items-center justify-between text-[#92989e]">
                  <span>Status:</span>
                  <span className="font-mono text-[#b8f34a] font-semibold">● ACTIVE SENSING</span>
                </div>
                <div className="flex items-center justify-between text-[#92989e]">
                  <span>Last Cycle:</span>
                  <span className="font-mono text-[#f5f5f2]">09:31:42 UTC</span>
                </div>
                <div className="flex items-center justify-between text-[#92989e]">
                  <span>Latency:</span>
                  <span className="font-mono text-[#f5f5f2]">420ms</span>
                </div>
              </div>

              <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-[11px] text-[#92989e] leading-relaxed">
                Illustrative monitoring telemetry. Streaming websocket and push notifications will connect in Phase 2 backend integration.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-[#24282c] pt-3 text-center">
          <span className="text-[10px] font-mono text-[#656b70]">
            EXOGEN SENSING NETWORK · v0.1
          </span>
        </div>
      </div>
    </div>
  );
}
