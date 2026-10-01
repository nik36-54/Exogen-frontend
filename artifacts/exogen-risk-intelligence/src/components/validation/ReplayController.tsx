import { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type { ReplayTimestampTick } from '@/types/validation-intelligence';

interface Props {
  ticks: ReplayTimestampTick[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export function ReplayController({ ticks, currentIndex, onSelectIndex }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x

  const currentTick = ticks[currentIndex] || ticks[0];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      const delay = Math.max(1200 / playbackSpeed, 350);
      interval = setInterval(() => {
        if (currentIndex >= ticks.length - 1) {
          setIsPlaying(false);
        } else {
          onSelectIndex(currentIndex + 1);
        }
      }, delay);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, currentIndex, ticks.length, onSelectIndex]);

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentIndex > 0) onSelectIndex(currentIndex - 1);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentIndex < ticks.length - 1) onSelectIndex(currentIndex + 1);
  };

  const handleJumpStart = () => {
    setIsPlaying(false);
    onSelectIndex(0);
  };

  const handleJumpEnd = () => {
    setIsPlaying(false);
    onSelectIndex(ticks.length - 1);
  };

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-4 sm:p-5 space-y-4">
      {/* Top Header of Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a2118] text-[#b8f34a] border border-[#b8f34a]/30">
            <Clock size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#b8f34a] uppercase tracking-wider">
                HISTORICAL RECONSTRUCTION TIMELINE
              </span>
              <span className="rounded bg-[#1f2427] px-1.5 py-0.5 text-[9px] font-mono text-[#939da2]">
                NO LOOK-AHEAD BIAS ENFORCED
              </span>
            </div>
            <div className="text-base font-semibold text-[#f5f5f2] flex items-center gap-2">
              <span>{currentTick.timestamp}</span>
              <span className="text-xs font-mono text-[#6c7479]">({currentTick.label})</span>
            </div>
          </div>
        </div>

        {/* Playback status pill */}
        <div className="flex items-center gap-2">
          {currentTick.warningTriggered ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[#ff5c5c]/40 bg-[#ff5c5c]/10 px-3 py-1 text-xs font-medium text-[#ff5c5c]">
              <span className="h-2 w-2 rounded-full bg-[#ff5c5c] animate-ping" />
              <span>EARLY WARNING ACTIVE</span>
            </div>
          ) : currentTick.hoursFromResolution === 0 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[#b8f34a]/40 bg-[#b8f34a]/10 px-3 py-1 text-xs font-medium text-[#b8f34a]">
              <span>EVENT RESOLUTION OCCURRED</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-[#24282c] bg-[#171a1d] px-3 py-1 text-xs font-mono text-[#8d969b]">
              <span>Sensing mode · {currentTick.hoursFromResolution}h to resolution</span>
            </div>
          )}
        </div>
      </div>

      {/* Scrubbable Timeline Slider with Marks */}
      <div className="space-y-2">
        <div className="relative pt-2">
          <input
            type="range"
            min={0}
            max={ticks.length - 1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              onSelectIndex(Number(e.target.value));
            }}
            className="w-full accent-[#b8f34a] cursor-pointer h-2 bg-[#1f2427] rounded-lg appearance-none"
          />

          {/* Tick markers */}
          <div className="flex justify-between text-[10px] font-mono text-[#6c7479] mt-2 px-1">
            {ticks.map((t, idx) => (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  onSelectIndex(idx);
                }}
                className={`flex flex-col items-center hover:text-[#f5f5f2] transition ${
                  idx === currentIndex ? 'text-[#b8f34a] font-bold' : ''
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full mb-1 ${
                    t.warningTriggered
                      ? 'bg-[#ff5c5c]'
                      : idx === ticks.length - 1
                      ? 'bg-[#b8f34a]'
                      : idx === currentIndex
                      ? 'bg-[#b8f34a]'
                      : 'bg-[#2b3337]'
                  }`}
                />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar: Play, Pause, Speeds, Next */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1f2427] pt-3">
        {/* Playback buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={handleJumpStart}
            title="Jump to Start"
            className="rounded-lg border border-[#24282c] bg-[#171a1d] p-2 text-[#939da2] hover:bg-[#202529] hover:text-[#f5f5f2] transition"
          >
            <SkipBack size={14} />
          </button>
          <button
            type="button"
            onClick={handleStepPrev}
            disabled={currentIndex === 0}
            title="Step Back"
            className="rounded-lg border border-[#24282c] bg-[#171a1d] p-2 text-[#939da2] hover:bg-[#202529] hover:text-[#f5f5f2] disabled:opacity-40 transition"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
              isPlaying
                ? 'bg-[#e5c07b] text-[#0a0a0b] hover:bg-[#d6af68]'
                : 'bg-[#b8f34a] text-[#0a0a0b] hover:bg-[#c6f765]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                <span>Play Timeline</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleStepNext}
            disabled={currentIndex === ticks.length - 1}
            title="Step Forward"
            className="rounded-lg border border-[#24282c] bg-[#171a1d] p-2 text-[#939da2] hover:bg-[#202529] hover:text-[#f5f5f2] disabled:opacity-40 transition"
          >
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            onClick={handleJumpEnd}
            title="Jump to Resolution"
            className="rounded-lg border border-[#24282c] bg-[#171a1d] p-2 text-[#939da2] hover:bg-[#202529] hover:text-[#f5f5f2] transition"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6c7479]">Speed:</span>
          <div className="flex rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-md transition ${
                  playbackSpeed === spd
                    ? 'bg-[#1b221a] text-[#b8f34a] font-bold'
                    : 'text-[#8d969b] hover:text-[#f5f5f2]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleJumpStart}
            className="flex items-center gap-1 text-[11px] text-[#8d969b] hover:text-[#b8f34a] transition ml-2"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
