export interface SizeChartRow {
  size: string;
  chest: number;
  length: number;
  shoulder: number;
  sleeve: number;
}

export const SIZE_CHART_ROWS: SizeChartRow[] = [
  { size: "S", chest: 42, length: 27.5, shoulder: 20, sleeve: 8.5 },
  { size: "M", chest: 44, length: 28, shoulder: 21, sleeve: 9 },
  { size: "L", chest: 46, length: 28.5, shoulder: 22, sleeve: 9.5 },
  { size: "XL", chest: 48, length: 29, shoulder: 23, sleeve: 10 },
  { size: "XXL", chest: 50, length: 29.5, shoulder: 24, sleeve: 10.5 },
];

export const SIZE_CHART_COLUMNS = [
  { key: "size", label: "Size" },
  { key: "chest", label: "Chest (in)" },
  { key: "length", label: "Length (in)" },
  { key: "shoulder", label: "Shoulder (in)" },
  { key: "sleeve", label: "Sleeve (in)" },
] as const;

export const SIZE_CHART_NOTE = "This is an oversized fit. Size down for a regular fit.";
