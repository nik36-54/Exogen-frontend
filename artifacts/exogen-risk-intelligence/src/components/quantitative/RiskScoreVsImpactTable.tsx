import { useLocation } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { impactAggregationSummary } from '@/data/quantitative-intelligence-data';

export function RiskScoreVsImpactTable() {
  const [, setLocation] = useLocation();

  const comparisonRows = [
    {
      eventId: 'CE-000184',
      eventTitle: 'Fed benchmark rate cut ≥50bps',
      riskId: 'RS-FED-RATE-CUT',
      score: 78,
      category: 'HIGH',
      exposureUsdM: 27.8,
      expectedImpactUsdM: 12.1,
      downsideImpactUsdM: 18.4,
    },
    {
      eventId: 'CE-000219',
      eventTitle: 'Brent crude oil >$120/barrel',
      riskId: 'RS-OIL-SHOCK',
      score: 64,
      category: 'MEDIUM',
      exposureUsdM: 19.2,
      expectedImpactUsdM: 7.4,
      downsideImpactUsdM: 13.1,
    },
    {
      eventId: 'CE-000304',
      eventTitle: 'Enhanced G-SIB capital adequacy rule',
      riskId: 'RS-GSIB-REG',
      score: 73,
      category: 'HIGH',
      exposureUsdM: 34.7,
      expectedImpactUsdM: 11.8,
      downsideImpactUsdM: 22.6,
    },
    {
      eventId: 'CE-000412',
      eventTitle: 'Semiconductor foundry export block',
      riskId: 'RS-CHIP-EXPORT',
      score: 68,
      category: 'MEDIUM',
      exposureUsdM: 22.4,
      expectedImpactUsdM: 6.6,
      downsideImpactUsdM: 15.2,
    },
    {
      eventId: 'CE-000529',
      eventTitle: 'Office commercial mortgage default >8.5%',
      riskId: 'RS-CRE-DEFAULT',
      score: 71,
      category: 'HIGH',
      exposureUsdM: 18.9,
      expectedImpactUsdM: 9.9,
      downsideImpactUsdM: 14.8,
    },
  ];

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="border-b border-[#24282c] pb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
          ANALYTICAL ALIGNMENT
        </span>
        <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
          Risk Score vs Dollar Impact Comparison
        </h3>
        <p className="mt-1 text-xs text-[#92989e]">
          Risk Score captures relative systemic significance; Dollar Impact measures modeled financial consequence under defined scenarios.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#24282c] text-[10px] font-mono uppercase text-[#92989e]">
              <th className="py-2.5 px-3">External Event</th>
              <th className="py-2.5 px-3 text-right">Risk Score</th>
              <th className="py-2.5 px-3 text-right">Modeled Exposure</th>
              <th className="py-2.5 px-3 text-right">Expected Impact</th>
              <th className="py-2.5 px-3 text-right">Downside Impact</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2225] text-xs">
            {comparisonRows.map((row) => (
              <tr
                key={row.eventId}
                onClick={() => setLocation(`/risk/scores/${row.riskId}`)}
                className="group hover:bg-[#171a1d] cursor-pointer transition"
              >
                <td className="py-3 px-3 font-medium text-[#f5f5f2] group-hover:text-[#b8f34a]">
                  {row.eventTitle}
                  <span className="ml-2 text-[10px] font-mono text-[#656b70]">
                    ({row.eventId})
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  <span
                    className={
                      row.score >= 70
                        ? 'text-[#b8f34a]'
                        : 'text-[#7c8cff]'
                    }
                  >
                    {row.score}
                  </span>
                  <span className="text-[10px] text-[#656b70] ml-1">({row.category})</span>
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#f5f5f2]">
                  ${row.exposureUsdM.toFixed(1)}M
                </td>
                <td className="py-3 px-3 text-right font-mono text-[#92989e]">
                  ${row.expectedImpactUsdM.toFixed(1)}M
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-[#b8f34a]">
                  ${row.downsideImpactUsdM.toFixed(1)}M
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#92989e] group-hover:text-[#b8f34a]">
                    Detail <ArrowUpRight className="h-3 w-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
