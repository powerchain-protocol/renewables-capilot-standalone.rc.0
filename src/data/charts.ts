import type { ChartSeries } from "@/types/chart";
export const SAMPLE_GENERATION_CHART: ChartSeries = { id:"generation-24h", label:"Generation", unit:"MWh", points:[24,28,35,32,41,43,39,47,42].map((value,i)=>({timestamp:`${String(i*3).padStart(2,"0")}:00`,value})) };
