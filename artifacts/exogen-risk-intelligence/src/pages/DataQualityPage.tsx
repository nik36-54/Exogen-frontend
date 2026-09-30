import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  Eye,
  FileCheck2,
  Filter,
  HelpCircle,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  XCircle,
} from 'lucide-react';
import {
  dataQualityAlertsList,
  dataQualityDimensionsList,
  dataQualityKPIs,
  freshnessDistribution,
  ingestionPipelineStagesList,
  normalizationQualityMetrics,
  oracleRecordsList,
  sampleFreshnessContracts,
  validationChecksList,
} from '@/data/canonical-matching-data';
import type {
  ContractFreshnessRecord,
  IngestionPipelineStage,
  OracleCompatibilityRecord,
} from '@/types/canonical-matching';
import { DataQualityMatrix } from '@/components/data-quality/DataQualityMatrix';
import { IngestionHealthDrawer } from '@/components/data-quality/IngestionHealthDrawer';
import { OracleExplanationModal } from '@/components/data-quality/OracleExplanationModal';
import { BusinessImpactAlert } from '@/components/data-quality/BusinessImpactAlert';

type NavTab = 'OVERVIEW' | 'FRESHNESS' | 'ORACLE' | 'VALIDATION' | 'INGESTION';

export default function DataQualityPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('dim-freshness');
  const [selectedStage, setSelectedStage] = useState<IngestionPipelineStage | null>(null);
  const [selectedOracle, setSelectedOracle] = useState<OracleCompatibilityRecord | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractFreshnessRecord>(sampleFreshnessContracts[0]);

  const handleSelectDimension = (dimId: string) => {
    setSelectedDimensionId(dimId);
    if (dimId === 'dim-freshness') setActiveTab('FRESHNESS');
    else if (dimId === 'dim-oracle') setActiveTab('ORACLE');
    else if (dimId === 'dim-validity' || dimId === 'dim-completeness') setActiveTab('VALIDATION');
    else if (dimId === 'dim-duplicates') setLocation('/matching');
  };

  return (
    <div className="space-y-7">
      {/* Title & Subtitle (Section 20) */}
      <div>
        <div className="flex items-center gap-2">
          <Database size={16} className="text-[#b8f34a]" />
          <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#b8f34a]">
            INTELLIGENCE FOUNDATION
          </span>
        </div>
        <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] text-[#f2f4ef]">
          Data Quality
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-[#8e989d]">
          Monitor freshness, completeness, validity, and resolution compatibility across external market data.
        </p>
      </div>

      {/* Top KPI Cards (Section 20) */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">QUALITY SCORE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {dataQualityKPIs.dataQualityScorePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Composite health</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">FRESH DATA</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {dataQualityKPIs.freshDataPct}%
          </div>
          <span className="text-[8px] text-[#606a70]">&lt; 15m active</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">ORACLE COMPATIBLE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {dataQualityKPIs.oracleCompatiblePct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Authoritative</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">VALID CONTRACTS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
            {dataQualityKPIs.validContractsPct}%
          </div>
          <span className="text-[8px] text-[#606a70]">Syntactic pass</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">STALE</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#f5c76c]">
            {dataQualityKPIs.staleCount}
          </div>
          <span className="text-[8px] text-[#606a70]">&gt; 60m latency</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">MISSING FIELDS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {dataQualityKPIs.missingFieldsCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Metadata gaps</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">INVALID OUTCOMES</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#ff6b6b]">
            {dataQualityKPIs.invalidOutcomesCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Malformed bounds</span>
        </div>
        <div className="rounded-[6px] border border-[#21272b] bg-[#111416] p-3 text-left">
          <span className="text-[8px] font-semibold tracking-[.12em] text-[#6b767b]">INGESTION ERRORS</span>
          <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
            {dataQualityKPIs.ingestionErrorsCount}
          </div>
          <span className="text-[8px] text-[#606a70]">Socket / API</span>
        </div>
      </section>

      {/* Quality Alerts Banner (Section 31) */}
      <section className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-4">
        <div className="flex items-center gap-2 border-b border-[#1f2427] pb-3">
          <AlertOctagon size={14} className="text-[#f5c76c]" />
          <span className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#f5c76c]">
            Active Data Quality Alerts
          </span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {dataQualityAlertsList.map((alert) => (
            <button
              key={alert.id}
              type="button"
              onClick={() => {
                if (alert.category === 'FRESHNESS') setActiveTab('FRESHNESS');
                else if (alert.category === 'ORACLE') setActiveTab('ORACLE');
                else if (alert.category === 'VALIDATION') setActiveTab('VALIDATION');
                else if (alert.category === 'REVIEW') setLocation('/matching');
              }}
              className="flex flex-col justify-between rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-3 text-left transition-colors hover:border-[#3a444a]"
            >
              <div>
                <div className="flex items-center justify-between text-[9px]">
                  <span className="font-semibold text-[#8ca3b8]">{alert.category}</span>
                  <span className="mono text-[#6c777d]">{alert.timestamp}</span>
                </div>
                <div className="mt-1 text-[12px] font-medium text-[#edf1eb]">{alert.title}</div>
                <p className="mt-1 text-[10px] text-[#848f95] line-clamp-2">{alert.description}</p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#1d2225] pt-2 text-[9px] text-[#6c767c]">
                <span>Affects {alert.affectedDownstream.riskSignalsCount} risk signals</span>
                <span className="text-[#b8f34a]">Inspect →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Navigation Sub-Tabs (Section 2) */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#1f2427] pb-3" role="tablist">
        <button
          type="button"
          onClick={() => setActiveTab('OVERVIEW')}
          className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#1b221a] text-[#b8f34a]'
              : 'text-[#848e93] hover:text-[#e4e8e4]'
          }`}
        >
          Overview & Matrix
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('FRESHNESS')}
          className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'FRESHNESS'
              ? 'bg-[#1b221a] text-[#b8f34a]'
              : 'text-[#848e93] hover:text-[#e4e8e4]'
          }`}
        >
          Freshness Monitor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ORACLE')}
          className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'ORACLE'
              ? 'bg-[#1b221a] text-[#b8f34a]'
              : 'text-[#848e93] hover:text-[#e4e8e4]'
          }`}
        >
          Oracle Compatibility
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('VALIDATION')}
          className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'VALIDATION'
              ? 'bg-[#1b221a] text-[#b8f34a]'
              : 'text-[#848e93] hover:text-[#e4e8e4]'
          }`}
        >
          Validation & Normalization
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('INGESTION')}
          className={`rounded px-3 py-1.5 text-[11px] font-medium transition-colors ${
            activeTab === 'INGESTION'
              ? 'bg-[#1b221a] text-[#b8f34a]'
              : 'text-[#848e93] hover:text-[#e4e8e4]'
          }`}
        >
          Ingestion Health Pipeline
        </button>
      </div>

      {/* TAB 1: OVERVIEW & MATRIX (Section 21 & Section 45) */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <DataQualityMatrix
            dimensions={dataQualityDimensionsList}
            onSelectDimension={handleSelectDimension}
            selectedDimensionId={selectedDimensionId}
          />

          {/* Section 45: Business Impact Alert Connection */}
          <BusinessImpactAlert
            contractTitle={selectedContract.contractTitle}
            affectedCanonicalCount={1}
            affectedSignalsCount={selectedContract.affectedRiskSignalsCount}
            affectedExposureUsdM={selectedContract.affectedExposureUsdM}
            onViewAffectedEvents={() => setLocation(`/events/${selectedContract.canonicalEventId}`)}
            onViewSignals={() => setLocation('/signals')}
          />

          {/* Section 30: Potential Duplicates Preview */}
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
              <div>
                <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                  CROSS-VENUE DUPLICATE CLUSTERING
                </span>
                <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
                  Potential Duplicates Detected
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLocation('/matching')}
                className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
              >
                <span>Review all in Matching</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="mt-4 rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2326] pb-2">
                <span className="text-[#8e989d]">
                  Polymarket: <strong className="text-[#d8ded6]">“Will Fed lower rates by 50bps+?”</strong> vs Kalshi: <strong className="text-[#d8ded6]">“Fed cuts ≥50bps before March”</strong>
                </span>
                <span className="mono rounded bg-[#182316] px-2 py-0.5 text-[10px] text-[#b8f34a]">
                  97.8% match probability
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] text-[#717b81]">
                  Identical subject, sovereign boundary, and deadline. Minor wording difference normalized.
                </span>
                <button
                  type="button"
                  onClick={() => setLocation('/matching')}
                  className="rounded bg-[#171c1f] px-3 py-1 text-[10px] font-semibold text-[#b8f34a] hover:bg-[#20272b]"
                >
                  Review in Matching →
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: FRESHNESS MONITOR (Section 22 & 23) */}
      {activeTab === 'FRESHNESS' && (
        <div className="space-y-6">
          {/* Freshness Distribution Bars (Section 22) */}
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              LATENCY SPECTRUM
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Contract Freshness Distribution
            </h2>
            <div className="mt-4 space-y-3">
              {freshnessDistribution.map((item) => (
                <div key={item.range}>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#9ea8ad]">{item.range}</span>
                    <span className="mono text-[#edf0ec]">
                      {item.pct}% ({item.count.toLocaleString()} contracts)
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-[#1b2023]">
                    <div
                      className={`h-2 rounded-full ${
                        item.range === '< 5 min'
                          ? 'bg-[#b8f34a]'
                          : item.range === '5–15 min'
                          ? 'bg-[#a3d853]'
                          : item.range === '15–60 min'
                          ? 'bg-[#f5c76c]'
                          : 'bg-[#ff6b6b]'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Freshness Table & Timeline (Section 22 & 23) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Table */}
            <div className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
              <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                CONTRACT OBSERVABILITY
              </span>
              <h3 className="mt-1 text-[15px] font-medium text-[#edf0eb]">
                Recent Ingested Contracts Status
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#1f2428] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                      <th className="py-2 pl-2">CONTRACT</th>
                      <th className="py-2">VENUE</th>
                      <th className="py-2 text-right">AGE</th>
                      <th className="py-2 pr-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2023]">
                    {sampleFreshnessContracts.map((c) => {
                      const isSelected = selectedContract.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedContract(c)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#181d19]' : 'hover:bg-[#14181a]'
                          }`}
                        >
                          <td className="max-w-[200px] py-2.5 pl-2 font-medium text-[#edf0ec] truncate">
                            {c.contractTitle}
                          </td>
                          <td className="py-2.5 text-[#919da2]">{c.venue}</td>
                          <td className="mono py-2.5 text-right text-[#b8f34a]">
                            {c.ageMinutes}m
                          </td>
                          <td className="py-2.5 pr-2 text-right">
                            <span
                              className={`mono text-[10px] font-semibold ${
                                c.status === 'Fresh'
                                  ? 'text-[#b8f34a]'
                                  : c.status === 'Aging'
                                  ? 'text-[#f5c76c]'
                                  : 'text-[#ff6b6b]'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freshness Timeline for Selected Contract (Section 23) */}
            <div className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5 text-[11px]">
              <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
                TIMELINE MONITOR
              </span>
              <h3 className="mt-1 text-[15px] font-medium text-[#edf0eb]">
                {selectedContract.contractTitle}
              </h3>
              <div className="mono mt-0.5 text-[9px] text-[#6b767b]">
                {selectedContract.id} · {selectedContract.venue}
              </div>

              {/* Sparkline visualization */}
              <div className="mt-4 rounded border border-[#21272b] bg-[#0c0f11] p-3">
                <span className="text-[8px] font-semibold tracking-[.1em] text-[#677278]">
                  ROLLING PROBABILITY TICK FEED
                </span>
                <div className="mt-2 flex items-baseline justify-between border-b border-[#1b2023] pb-2">
                  <span className="text-[#8e989d]">Current Probability:</span>
                  <span className="mono text-[18px] font-semibold text-[#b8f34a]">
                    {selectedContract.probabilityPct}%
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9px] text-[#6d777d]">
                  {selectedContract.recentProbabilities.map((pt, i) => (
                    <div key={i} className="text-center">
                      <div className="text-[#c5cdc3]">{pt.probabilityPct}%</div>
                      <div className="text-[8px] text-[#555f65]">{pt.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#1f2427] pt-3 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-[#758187]">Update Frequency:</span>
                  <span className="mono text-[#edf0ec]">{selectedContract.updateFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#758187]">Last Successful Run:</span>
                  <span className="mono text-[#edf0ec]">{selectedContract.lastSuccessfulIngestion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#758187]">Expected Refresh Interval:</span>
                  <span className="mono text-[#b8f34a]">{selectedContract.expectedRefreshInterval}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORACLE COMPATIBILITY (Section 24 & 25) */}
      {activeTab === 'ORACLE' && (
        <div className="space-y-6">
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              RESOLUTION AUDIT
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Oracle Compatibility Records
            </h2>
            <p className="mt-1 text-[12px] text-[#869197]">
              Every contract is evaluated to confirm whether its resolution source can authoritatively determine the real-world outcome.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {oracleRecordsList.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col justify-between rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#1d2225] pb-2">
                      <span className="mono text-[9px] text-[#6d777d]">{rec.id}</span>
                      <span
                        className={`mono rounded px-2 py-0.5 text-[9px] font-semibold ${
                          rec.compatibility === 'TRUE'
                            ? 'bg-[#182316] text-[#b8f34a]'
                            : rec.compatibility === 'UNKNOWN'
                            ? 'bg-[#272115] text-[#f5c76c]'
                            : 'bg-[#291717] text-[#ff6b6b]'
                        }`}
                      >
                        ORACLE: {rec.compatibility} ({rec.confidencePct}%)
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-[13px] font-medium text-[#edf0eb]">
                      {rec.eventTitle}
                    </h3>
                    <div className="mt-2 text-[10px] text-[#849096]">
                      <span>Source: </span>
                      <strong className="text-[#d8ded6]">{rec.oracleSource}</strong>
                    </div>
                    <p className="mt-2 text-[10px] text-[#717b81] line-clamp-2">
                      {rec.rationale}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#1d2225] pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOracle(rec)}
                      className="flex w-full items-center justify-center gap-1 rounded border border-[#262e33] bg-[#121619] py-1.5 text-[10px] text-[#c9d0cc] hover:bg-[#1a2024]"
                    >
                      <span>Why Oracle = {rec.compatibility}?</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: VALIDATION & NORMALIZATION (Section 26 & 27) */}
      {activeTab === 'VALIDATION' && (
        <div className="space-y-6">
          {/* Normalization Quality Metrics (Section 27) */}
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              NATURAL LANGUAGE PARSING ACCURACY
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Normalization Quality
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {normalizationQualityMetrics.map((norm) => (
                <div key={norm.field} className="rounded border border-[#21272b] bg-[#0c0f11] p-3 text-left">
                  <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
                    {norm.field.toUpperCase()}
                  </span>
                  <div className="mono mt-1 text-[22px] font-semibold text-[#b8f34a]">
                    {norm.ratePct.toFixed(1)}%
                  </div>
                  <p className="mt-1 text-[9px] text-[#758187] line-clamp-2">{norm.sample}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contract Validation Checklist (Section 26) */}
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              SYNTACTIC INGESTION VALIDATOR
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Contract Validation Inspection
            </h2>
            <div className="mt-4 space-y-4">
              {validationChecksList.map((val) => (
                <div key={val.id} className="rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-4 text-[11px]">
                  <div className="flex items-center justify-between border-b border-[#1d2225] pb-2">
                    <div>
                      <span className="mono font-semibold text-[#8ca3b8]">{val.contractId}</span>
                      <span className="ml-2 font-medium text-[#edf0eb]">{val.title}</span>
                    </div>
                    <span
                      className={`mono text-[10px] font-semibold ${
                        val.isValid ? 'text-[#b8f34a]' : 'text-[#ff6b6b]'
                      }`}
                    >
                      {val.isValid ? 'VALID' : 'FAILED VALIDATION'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                    {val.checks.map((chk) => (
                      <div key={chk.name} className="flex items-center gap-1.5 text-[10px]">
                        {chk.passed ? (
                          <CheckCircle2 size={12} className="shrink-0 text-[#b8f34a]" />
                        ) : (
                          <XCircle size={12} className="shrink-0 text-[#ff6b6b]" />
                        )}
                        <span className={chk.passed ? 'text-[#9fa9ad]' : 'text-[#ff9b9b] font-medium'}>
                          {chk.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {val.failureReasons && (
                    <div className="mt-3 rounded border border-[#3b1c1c] bg-[#191010] p-2 text-[10px] text-[#ffa3a3]">
                      <span>Flagged failure reasons: </span>
                      <strong>{val.failureReasons.join(' · ')}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: INGESTION HEALTH PIPELINE (Section 28 & 29) */}
      {activeTab === 'INGESTION' && (
        <div className="space-y-6">
          <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5">
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              END-TO-END FEED INTEGRITY
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Ingestion Health Pipeline
            </h2>
            <p className="mt-1 text-[12px] text-[#869197]">
              Click any stage to open the pipeline latency and error telemetry inspector.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {ingestionPipelineStagesList.map((stg) => (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setSelectedStage(stg)}
                  className="rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-3 text-left transition-colors hover:border-[#38434a] hover:bg-[#13171a]"
                >
                  <div className="flex items-center justify-between text-[8px] text-[#6d777d]">
                    <span>STAGE 0{stg.stageOrder}</span>
                    <span className="mono text-[#b8f34a]">{stg.status}</span>
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium text-[#edf0ec]">
                    {stg.name}
                  </div>
                  <div className="mono mt-2 text-[10px] text-[#8e989d]">
                    {stg.processedCount.toLocaleString()} proc · {stg.failedCount} err
                  </div>
                  <div className="mono mt-1 text-[9px] text-[#b8f34a]">
                    ~{stg.averageLatencyMs}ms avg
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Stage Detail Drawer */}
      <IngestionHealthDrawer
        isOpen={!!selectedStage}
        onClose={() => setSelectedStage(null)}
        stage={selectedStage}
      />

      {/* Oracle Explanation Modal */}
      <OracleExplanationModal
        isOpen={!!selectedOracle}
        onClose={() => setSelectedOracle(null)}
        record={selectedOracle}
      />
    </div>
  );
}
