import { useState } from 'react';
import { Sliders, X, Check, Bell, AlertTriangle } from 'lucide-react';
import type { AlertRule } from '@/types/monitoring-intelligence';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (rule: Partial<AlertRule>) => void;
}

export function AlertBuilderDrawer({ isOpen, onClose, onSave }: Props) {
  const [entityName, setEntityName] = useState('Interest Rate Risk');
  const [metric, setMetric] = useState<'probability' | 'risk_score' | 'exposure' | 'impact'>('risk_score');
  const [operator, setOperator] = useState<'gt' | 'gte' | 'lt' | 'change_gt'>('gt');
  const [threshold, setThreshold] = useState('75');
  const [confidenceReq, setConfidenceReq] = useState('80');
  const [frequency, setFrequency] = useState<'IMMEDIATELY' | 'HOURLY' | 'DAILY_DIGEST'>('IMMEDIATELY');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (onSave) {
      onSave({
        name: `${entityName} ${metric} ${operator} ${threshold}`,
        entityName,
        metric,
        operator,
        threshold: Number(threshold),
        thresholdLabel: `${metric} ${operator} ${threshold}`,
        additionalCondition: `Confidence > ${confidenceReq}%`,
        frequency,
        enabled: true,
      });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-md border-l border-[#24282c] bg-[#111416] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#24282c] pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                CREATE ALERT RULE
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between rounded bg-[#171a1d] px-3 py-1.5 border border-[#24282c]">
            <span className="text-[10px] font-mono text-[#92989e]">RULE BUILDER · DEMO SPECIFICATION</span>
            <span className="rounded bg-[#b8f34a]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#b8f34a]">
              IN-APP SENTINEL
            </span>
          </div>

          <p className="mt-4 text-xs text-[#92989e] leading-relaxed">
            Configure automated alerts triggered when external events, risk scores, or business exposures cross custom institutional thresholds.
          </p>

          {/* Form fields */}
          <div className="mt-6 space-y-4 text-xs">
            {/* Target Entity */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#f5f5f2]">Target Entity</label>
              <input
                type="text"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g. Interest Rate Risk, Fed Rate Cut..."
                className="w-full rounded-lg border border-[#24282c] bg-[#171a1d] p-2.5 text-xs text-[#f5f5f2] focus:border-[#b8f34a] focus:outline-none"
              />
            </div>

            {/* Condition Metric */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#f5f5f2]">Monitored Metric</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as any)}
                className="w-full rounded-lg border border-[#24282c] bg-[#171a1d] p-2.5 text-xs text-[#f5f5f2] focus:border-[#b8f34a] focus:outline-none"
              >
                <option value="risk_score">Risk Score (0 - 100)</option>
                <option value="probability">Market Probability (%)</option>
                <option value="exposure">Modeled Exposure ($M)</option>
                <option value="impact">Downside Impact ($M)</option>
              </select>
            </div>

            {/* Operator and Threshold */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#f5f5f2]">Operator</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as any)}
                  className="w-full rounded-lg border border-[#24282c] bg-[#171a1d] p-2.5 text-xs text-[#f5f5f2] focus:border-[#b8f34a] focus:outline-none"
                >
                  <option value="gt">Greater than (&gt;)</option>
                  <option value="gte">Greater or equal (≥)</option>
                  <option value="change_gt">Increase in 24h &gt;</option>
                  <option value="lt">Less than (&lt;)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#f5f5f2]">Threshold Value</label>
                <input
                  type="text"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="e.g. 75, 10.0..."
                  className="w-full rounded-lg border border-[#24282c] bg-[#171a1d] p-2.5 text-xs font-mono text-[#b8f34a] focus:border-[#b8f34a] focus:outline-none"
                />
              </div>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#f5f5f2]">Evidence Confidence Filter</label>
              <div className="flex items-center gap-2">
                <span className="text-[#92989e]">Require confidence ≥</span>
                <input
                  type="number"
                  min="50"
                  max="95"
                  value={confidenceReq}
                  onChange={(e) => setConfidenceReq(e.target.value)}
                  className="w-16 rounded border border-[#24282c] bg-[#171a1d] p-1.5 text-center font-mono text-[#f5f5f2] focus:outline-none"
                />
                <span className="text-[#92989e]">%</span>
              </div>
            </div>

            {/* Notification Frequency */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#f5f5f2]">Notification Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['IMMEDIATELY', 'HOURLY', 'DAILY_DIGEST'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`rounded-lg border p-2 text-center text-[10px] font-mono transition ${
                      frequency === freq
                        ? 'border-[#b8f34a] bg-[#b8f34a]/10 text-[#b8f34a]'
                        : 'border-[#24282c] bg-[#171a1d] text-[#92989e] hover:text-[#f5f5f2]'
                    }`}
                  >
                    {freq.split('_')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 border-t border-[#24282c] pt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-[#24282c] bg-[#171a1d] py-2 text-xs font-medium text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 flex items-center justify-center gap-1.5 rounded bg-[#b8f34a] py-2 text-xs font-medium text-[#0a0a0b] hover:bg-[#a6e03b]"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saved ? 'Rule Created' : 'Create Alert Rule'}
          </button>
        </div>
      </div>
    </div>
  );
}
