import { useState } from 'react';
import { Sliders, X, Check, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (thresholds: { lowMax: number; mediumMax: number; highMax: number }) => void;
}

export function RiskThresholdConfigDrawer({ isOpen, onClose, onSave }: Props) {
  const [lowMax, setLowMax] = useState(39);
  const [mediumMax, setMediumMax] = useState(69);
  const [highMax, setHighMax] = useState(84);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setLowMax(39);
    setMediumMax(69);
    setHighMax(84);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ lowMax, mediumMax, highMax });
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
          <div className="flex items-center justify-between border-b border-[#24282c] pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                RISK SCORE THRESHOLDS
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
            <span className="text-[10px] font-mono text-[#92989e]">CURRENT SETTING: DEMO THRESHOLDS</span>
            <span className="rounded bg-[#ff5c5c]/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-[#ff5c5c]">
              UNSAVED DRAFT
            </span>
          </div>

          <p className="mt-4 text-xs text-[#92989e] leading-relaxed">
            Customize the score boundaries used to classify scored events into risk tiers. These thresholds calibrate corporate alerting and escalation workflows.
          </p>

          <div className="mt-6 space-y-5">
            {/* Low */}
            <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#92989e]">LOW RISK</span>
                <span className="font-mono text-xs font-bold text-[#92989e]">0 – {lowMax}</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={lowMax}
                onChange={(e) => setLowMax(Number(e.target.value))}
                className="mt-3 w-full accent-[#92989e]"
              />
            </div>

            {/* Medium */}
            <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7c8cff]">MEDIUM RISK</span>
                <span className="font-mono text-xs font-bold text-[#7c8cff]">{lowMax + 1} – {mediumMax}</span>
              </div>
              <input
                type="range"
                min={lowMax + 1}
                max="75"
                value={mediumMax}
                onChange={(e) => setMediumMax(Number(e.target.value))}
                className="mt-3 w-full accent-[#7c8cff]"
              />
            </div>

            {/* High */}
            <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#b8f34a]">HIGH RISK</span>
                <span className="font-mono text-xs font-bold text-[#b8f34a]">{mediumMax + 1} – {highMax}</span>
              </div>
              <input
                type="range"
                min={mediumMax + 1}
                max="90"
                value={highMax}
                onChange={(e) => setHighMax(Number(e.target.value))}
                className="mt-3 w-full accent-[#b8f34a]"
              />
            </div>

            {/* Critical */}
            <div className="rounded border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#ff5c5c]">CRITICAL RISK</span>
                <span className="font-mono text-xs font-bold text-[#ff5c5c]">{highMax + 1} – 100</span>
              </div>
              <p className="mt-2 text-[11px] text-[#92989e]">
                Automatically triggers executive committee notification and capital buffer reassessment.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded bg-[#0a0a0b] p-3 text-[11px] text-[#656b70] border border-[#24282c]">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#ff5c5c]" />
            Demo thresholds are illustrative. They will be linked to institutional risk appetite frameworks in Phase 2.
          </div>
        </div>

        <div className="mt-8 border-t border-[#24282c] pt-4 flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 rounded border border-[#24282c] bg-[#171a1d] px-4 py-2 text-xs font-medium text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-1.5 rounded bg-[#b8f34a] py-2 text-xs font-medium text-[#0a0a0b] hover:bg-[#a6e03b]"
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saved ? 'Saved Demo Thresholds' : 'Apply Thresholds'}
          </button>
        </div>
      </div>
    </div>
  );
}
