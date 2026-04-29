import { SIZE_CHART_COLUMNS, SIZE_CHART_NOTE, SIZE_CHART_ROWS } from "@/lib/size-chart";
import { cn } from "@/lib/utils";

interface SizeChartTableProps {
  className?: string;
}

function formatMeasurement(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function SizeChartTable({ className }: SizeChartTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:rgba(8,12,24,0.68)]",
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-[color:rgba(61,79,214,0.16)]">
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
      <div className="border-t border-[color:var(--glass-border)] px-4 py-4 text-[0.95rem] leading-7 text-[color:var(--text-muted)] md:px-5">
        {SIZE_CHART_NOTE}
      </div>
    </div>
  );
}
