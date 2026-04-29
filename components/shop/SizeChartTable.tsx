import { SIZE_CHART_COLUMNS, SIZE_CHART_NOTE, SIZE_CHART_ROWS } from "@/lib/size-chart";
import { cn } from "@/lib/utils";

interface SizeChartTableProps {
  className?: string;
}

function formatMeasurement(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const MOBILE_MEASUREMENTS = [
  { key: "chest", label: "Chest", getValue: (row: (typeof SIZE_CHART_ROWS)[number]) => formatMeasurement(row.chest) },
  { key: "length", label: "Length", getValue: (row: (typeof SIZE_CHART_ROWS)[number]) => formatMeasurement(row.length) },
  {
    key: "shoulder",
    label: "Shoulder",
    getValue: (row: (typeof SIZE_CHART_ROWS)[number]) => formatMeasurement(row.shoulder),
  },
  { key: "sleeve", label: "Sleeve", getValue: (row: (typeof SIZE_CHART_ROWS)[number]) => formatMeasurement(row.sleeve) },
] as const;

export function SizeChartTable({ className }: SizeChartTableProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-3 lg:hidden">
        {SIZE_CHART_ROWS.map((row) => (
          <article
            key={row.size}
            className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.03)] px-4 py-4"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="t-label text-[color:var(--text-subtle)]">Size</div>
              <div className="font-display text-[1.1rem] font-semibold tracking-[-0.02em] text-[color:var(--text)]">
                {row.size}
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {MOBILE_MEASUREMENTS.map((measurement) => (
                <div
                  key={measurement.key}
                  className="rounded-[18px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-3 py-3"
                >
                  <dt className="t-label text-[color:var(--text-subtle)]">{measurement.label}</dt>
                  <dd className="mt-2 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text-muted)]">
                    {measurement.getValue(row)}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(10,10,20,0.68)] lg:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-[color:rgba(255,255,255,0.035)]">
            <tr>
              {SIZE_CHART_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="border-b border-[color:var(--glass-border)] px-4 py-3 font-display text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--text)] md:px-5"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART_ROWS.map((row) => (
              <tr key={row.size} className="odd:bg-[color:rgba(255,255,255,0.015)]">
                <td className="border-b border-[color:var(--glass-border)] px-4 py-4 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text)] md:px-5">
                  {row.size}
                </td>
                <td className="border-b border-[color:var(--glass-border)] px-4 py-4 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text-muted)] md:px-5">
                  {formatMeasurement(row.chest)}
                </td>
                <td className="border-b border-[color:var(--glass-border)] px-4 py-4 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text-muted)] md:px-5">
                  {formatMeasurement(row.length)}
                </td>
                <td className="border-b border-[color:var(--glass-border)] px-4 py-4 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text-muted)] md:px-5">
                  {formatMeasurement(row.shoulder)}
                </td>
                <td className="border-b border-[color:var(--glass-border)] px-4 py-4 font-display text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--text-muted)] md:px-5">
                  {formatMeasurement(row.sleeve)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-[24px] border border-[color:var(--glass-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-4 text-[0.95rem] leading-7 text-[color:var(--text-muted)] md:px-5">
        {SIZE_CHART_NOTE}
      </div>
    </div>
  );
}
