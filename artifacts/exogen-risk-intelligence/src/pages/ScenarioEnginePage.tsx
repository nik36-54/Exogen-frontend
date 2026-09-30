import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  SlidersHorizontal,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  runCustomScenarioCalculation,
  sensitivityAssumptions,
  sensitivityMatrix,
  probabilityImpactCurvePoints,
} from '@/data/quantitative-intelligence-data';
import { SensitivityMatrixView } from '@/components/quantitative/SensitivityMatrixView';
import { ScenarioPropagationFlow } from '@/components/quantitative/ScenarioPropagationFlow';

export default function ScenarioEnginePage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'BASE' | 'UPSIDE' | 'DOWNSIDE' | 'SEVERE' | 'CUSTOM'>('DOWNSIDE');

  // Custom Scenario Form State
  const [scenarioName, setScenarioName] = useState('Fed Cut — Severe Repricing');
  const [probabilityPct, setProbabilityPct] = useState(66.1);
  const [exposureUsdM, setExposureUsdM] = useState(27.8);
  const [magnitudePct, setMagnitudePct] = useState(65);
  const [transmissionMultiplier, setTransmissionMultiplier] = useState(1.0);
  const [confidenceAdjustment, setConfidenceAdjustment] = useState(0);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedScenariosList, setSavedScenariosList] = useState<string[]>([
    'Base Standard (30%)',
    'Downside Baseline (65%)',
    'Severe Liquidity Shock (115%)',
  ]);

  // Reactive calculation
  const calculatedOutput = useMemo(() => {
    return runCustomScenarioCalculation({
      name: scenarioName,
      baseScenarioType: activeTab,
      probabilityPct,
      modeledExposureUsdM: exposureUsdM,
      scenarioMagnitudePct: magnitudePct,
      transmissionMultiplier,
      confidenceAdjustmentPct: confidenceAdjustment,
    });
  }, [
    scenarioName,
    activeTab,
    probabilityPct,
    exposureUsdM,
    magnitudePct,
    transmissionMultiplier,
    confidenceAdjustment,
  ]);

  const handleReset = () => {
    setProbabilityPct(66.1);
    setExposureUsdM(27.8);
    setMagnitudePct(30);
    setTransmissionMultiplier(1.0);
    setConfidenceAdjustment(0);
    setScenarioName('Fed Cut — Base Scenario');
    setActiveTab('BASE');
  };

  const handleSelectTab = (tab: 'BASE' | 'UPSIDE' | 'DOWNSIDE' | 'SEVERE' | 'CUSTOM') => {
    setActiveTab(tab);
    if (tab === 'BASE') {
      setMagnitudePct(30);
      setTransmissionMultiplier(1.0);
      setScenarioName('Fed Cut — Base Case');
    } else if (tab === 'UPSIDE') {
      setMagnitudePct(15);
      setTransmissionMultiplier(0.8);
      setScenarioName('Fed Cut — Soft Landing Upside');
    } else if (tab === 'DOWNSIDE') {
      setMagnitudePct(65);
      setTransmissionMultiplier(1.0);
      setScenarioName('Fed Cut — Downside Repricing');
    } else if (tab === 'SEVERE') {
      setMagnitudePct(115);
      setTransmissionMultiplier(1.5);
      setScenarioName('Fed Cut — Severe Liquidity Dislocation');
    }
  };

  const handleSaveScenario = () => {
    if (!savedScenariosList.includes(scenarioName)) {
      setSavedScenariosList((prev) => [...prev, scenarioName]);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              QUANTITATIVE RISK INTELLIGENCE · LAYER 05
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              INTERACTIVE ENGINE
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Scenario Engine
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Explore how potential dollar impact and risk score adapt dynamically under varied market probability and business stress assumptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation('/impact')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#111416] px-3.5 py-2 text-xs font-medium text-[#92989e] hover:text-[#f5f5f2]"
          >
            ← Dollar Impact Directory
          </button>
        </div>
      </div>

      {/* Preset Scenario Tabs */}
      <div className="flex items-center justify-between border-b border-[#24282c] pb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {(['BASE', 'UPSIDE', 'DOWNSIDE', 'SEVERE', 'CUSTOM'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleSelectTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition ${
                activeTab === tab
                  ? tab === 'SEVERE'
                    ? 'bg-[#ff5c5c]/10 text-[#ff5c5c] border border-[#ff5c5c]/40'
                    : 'bg-[#b8f34a]/10 text-[#b8f34a] border border-[#b8f34a]/40'
                  : 'text-[#92989e] hover:bg-[#171a1d] hover:text-[#f5f5f2]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-[#656b70] hidden sm:block">
          TARGET: CE-000184 (Fed Rate Cut ≥50bps)
        </div>
      </div>

      {/* Custom Scenario Workspace: "Build a Scenario" */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              WORKSPACE INTERFACE
            </span>
            <h2 className="mt-0.5 text-lg font-semibold text-[#f5f5f2]">
              Build & Calibrate Scenario
            </h2>
          </div>

          {/* Scenario Name Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#92989e]">Scenario Name:</span>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="rounded-lg border border-[#24282c] bg-[#171a1d] px-3 py-1 text-xs text-[#f5f5f2] font-medium focus:border-[#b8f34a] focus:outline-none w-64"
            />
          </div>
        </div>

        {/* 2-Column Grid: Left Controls, Right Output Card */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Probability Input */}
            <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#f5f5f2]">Market Probability (P_M)</span>
                  <div className="text-[10px] text-[#656b70]">Derived from prediction market consensus</div>
                </div>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#b8f34a]">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    step="0.1"
                    value={probabilityPct}
                    onChange={(e) => setProbabilityPct(Number(e.target.value))}
                    className="w-16 rounded border border-[#24282c] bg-[#0a0a0b] px-2 py-0.5 text-right text-xs text-[#b8f34a] focus:outline-none"
                  />
                  <span>%</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="0.5"
                value={probabilityPct}
                onChange={(e) => setProbabilityPct(Number(e.target.value))}
                className="mt-3 w-full accent-[#b8f34a]"
              />
            </div>

            {/* Modeled Exposure Input */}
            <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#f5f5f2]">Modeled Baseline Exposure</span>
                  <div className="text-[10px] text-[#656b70]">EXP-00072 (Commercial Banking + Markets)</div>
                </div>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#f5f5f2]">
                  <span>$</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={exposureUsdM}
                    onChange={(e) => setExposureUsdM(Number(e.target.value))}
                    className="w-16 rounded border border-[#24282c] bg-[#0a0a0b] px-2 py-0.5 text-right text-xs text-[#f5f5f2] focus:outline-none"
                  />
                  <span>M</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={exposureUsdM}
                onChange={(e) => setExposureUsdM(Number(e.target.value))}
                className="mt-3 w-full accent-[#7c8cff]"
              />
            </div>

            {/* Scenario Magnitude Slider */}
            <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#f5f5f2]">Scenario Magnitude (Severity Multiplier)</span>
                  <div className="text-[10px] text-[#656b70]">Base: 30% · Downside: 65% · Severe: 115%</div>
                </div>
                <span className="font-mono text-sm font-bold text-[#7c8cff]">{magnitudePct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={magnitudePct}
                onChange={(e) => setMagnitudePct(Number(e.target.value))}
                className="mt-3 w-full accent-[#7c8cff]"
              />
            </div>

            {/* Transmission Multiplier & Confidence Adjustment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">Transmission</span>
                  <span className="font-mono font-bold text-[#b8f34a]">{transmissionMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={transmissionMultiplier}
                  onChange={(e) => setTransmissionMultiplier(Number(e.target.value))}
                  className="mt-3 w-full accent-[#b8f34a]"
                />
              </div>

              <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">Confidence Adjustment</span>
                  <span className="font-mono font-bold text-[#92989e]">{confidenceAdjustment > 0 ? `+${confidenceAdjustment}` : confidenceAdjustment}%</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="15"
                  step="1"
                  value={confidenceAdjustment}
                  onChange={(e) => setConfidenceAdjustment(Number(e.target.value))}
                  className="mt-3 w-full accent-[#92989e]"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-4 py-2 text-xs font-medium text-[#92989e] hover:text-[#f5f5f2]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset to Base
              </button>
              <button
                onClick={handleSaveScenario}
                className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-4 py-2 text-xs font-medium text-[#0a0a0b] hover:bg-[#a6e03b]"
              >
                {savedSuccess ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                {savedSuccess ? 'Saved Scenario' : 'Save Scenario'}
              </button>
            </div>
          </div>

          {/* Real-Time Reactive Output Display (5 Cols) */}
          <div className="lg:col-span-5 rounded-xl border border-[#b8f34a]/30 bg-[#0a0a0b] p-6 space-y-6 shadow-xl">
            <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                  REACTIVE RESULT
                </span>
                <h3 className="text-sm font-semibold text-[#f5f5f2] mt-0.5 truncate max-w-xs">
                  {scenarioName}
                </h3>
              </div>
              <span className="rounded bg-[#171a1d] px-2 py-0.5 text-[10px] font-mono text-[#92989e] border border-[#24282c]">
                LIVE CALC
              </span>
            </div>

            {/* Potential Impact Callout */}
            <div className="rounded-lg border border-[#24282c] bg-[#111416] p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                POTENTIAL DOLLAR IMPACT
              </div>
              <div className="mt-1 text-4xl font-mono font-bold text-[#b8f34a]">
                ${calculatedOutput.potentialImpactUsdM.toFixed(1)}M
              </div>
              <div className="mt-1 text-[11px] text-[#656b70]">
                Expected (prob-weighted): ${calculatedOutput.expectedImpactUsdM.toFixed(1)}M
              </div>
            </div>

            {/* Risk Score Callout */}
            <div className="rounded-lg border border-[#24282c] bg-[#111416] p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                REACTIVE RISK SCORE
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-[#f5f5f2]">
                  {calculatedOutput.riskScore}
                </span>
                <span className="text-sm font-mono text-[#656b70]">/ 100</span>
                <span
                  className={`ml-2 rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                    calculatedOutput.riskScore >= 70
                      ? 'bg-[#b8f34a]/10 text-[#b8f34a]'
                      : 'bg-[#7c8cff]/10 text-[#7c8cff]'
                  }`}
                >
                  {calculatedOutput.riskScore >= 70 ? 'HIGH' : 'MEDIUM'}
                </span>
              </div>
            </div>

            {/* Scenario Assumption Audit (Diff vs Base) */}
            <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-4 text-xs space-y-2">
              <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#92989e]">
                ASSUMPTION AUDIT (VS BASE)
              </div>
              <div className="flex items-center justify-between text-[#92989e]">
                <span>Base Magnitude</span>
                <span className="font-mono text-[#f5f5f2]">30%</span>
              </div>
              <div className="flex items-center justify-between text-[#92989e]">
                <span>Scenario Magnitude</span>
                <span className="font-mono text-[#7c8cff]">{magnitudePct}%</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#24282c] pt-2 text-[#92989e]">
                <span>Variance Difference</span>
                <span className="font-mono font-bold text-[#b8f34a]">
                  {magnitudePct >= 30 ? `+${magnitudePct - 30}` : magnitudePct - 30} percentage pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Comparison UX (Section 27 & 47) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="border-b border-[#24282c] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            CROSS-SCENARIO BENCHMARK
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Scenario Comparison Matrix
          </h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#24282c] text-[10px] font-mono uppercase text-[#92989e]">
                <th className="py-2.5 px-3">Metric Dimension</th>
                <th className="py-2.5 px-3 text-right">Base Scenario</th>
                <th className="py-2.5 px-3 text-right">Downside Scenario</th>
                <th className="py-2.5 px-3 text-right">Severe Scenario</th>
                <th className="py-2.5 px-3 text-right">Custom Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2225] text-xs font-mono">
              <tr>
                <td className="py-3 px-3 text-[#92989e] font-sans">Market Probability</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">66.1%</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">66.1%</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">66.1%</td>
                <td className="py-3 px-3 text-right text-[#b8f34a] font-bold">{probabilityPct.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#92989e] font-sans">Modeled Exposure</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">$27.8M</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">$27.8M</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">$27.8M</td>
                <td className="py-3 px-3 text-right text-[#b8f34a] font-bold">${exposureUsdM.toFixed(1)}M</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#92989e] font-sans">Scenario Magnitude</td>
                <td className="py-3 px-3 text-right text-[#7c8cff]">30%</td>
                <td className="py-3 px-3 text-right text-[#7c8cff]">65%</td>
                <td className="py-3 px-3 text-right text-[#ff5c5c]">115%</td>
                <td className="py-3 px-3 text-right text-[#b8f34a] font-bold">{magnitudePct}%</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#92989e] font-sans">Potential Dollar Impact</td>
                <td className="py-3 px-3 text-right text-[#f5f5f2]">$8.2M</td>
                <td className="py-3 px-3 text-right text-[#b8f34a] font-bold">$18.4M</td>
                <td className="py-3 px-3 text-right text-[#ff5c5c] font-bold">$31.7M</td>
                <td className="py-3 px-3 text-right text-[#b8f34a] font-bold text-sm">
                  ${calculatedOutput.potentialImpactUsdM.toFixed(1)}M
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-[#92989e] font-sans">Confidence Rating</td>
                <td className="py-3 px-3 text-right text-[#b8f34a]">HIGH</td>
                <td className="py-3 px-3 text-right text-[#7c8cff]">MEDIUM</td>
                <td className="py-3 px-3 text-right text-[#ff5c5c]">LOW</td>
                <td className="py-3 px-3 text-right text-[#7c8cff] font-bold">{calculatedOutput.confidenceRating}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Propagation Flow (Section 34) */}
      <ScenarioPropagationFlow />

      {/* Sensitivity Analysis & Matrix (Section 28 & 29) */}
      <SensitivityMatrixView
        matrix={sensitivityMatrix}
        assumptions={sensitivityAssumptions}
      />

      {/* Probability vs Impact Curve (Section 35) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="border-b border-[#24282c] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            CONTINUOUS SENSITIVITY CURVE
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Probability vs Potential Impact Curve
          </h3>
          <p className="mt-1 text-xs text-[#92989e]">
            Illustrative dollar impact scaling as market consensus probability transitions between 40% and 80%.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {probabilityImpactCurvePoints.map((pt) => (
            <div key={pt.probabilityPct} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-center">
              <div className="text-[10px] font-mono text-[#92989e]">
                AT {pt.probabilityPct}% PROBABILITY
              </div>
              <div className="mt-1 text-xl font-mono font-bold text-[#b8f34a]">
                ${pt.impactUsdM.toFixed(1)}M
              </div>
              <div className="mt-1 text-[9px] font-mono text-[#656b70]">
                Ratio: {(pt.impactUsdM / (pt.probabilityPct / 100)).toFixed(1)}x
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
