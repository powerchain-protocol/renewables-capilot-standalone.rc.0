export type ChartPoint = { timestamp: string; value: number; secondary?: number };
export type ChartSeries = { id: string; label: string; unit: string; points: ChartPoint[] };
