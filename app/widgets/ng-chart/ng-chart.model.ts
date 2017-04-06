type StringOptionResolver = (data: any, index: number) => string;
type NumberOptionResolver = (data: any, index: number) => number;

type ChartType = "line" | "bar" | "scatterPlot" | "pie";

interface LineChartOptions {
  chartType: ChartType;
  xAxisProperty: string;
  yAxisProperty: string;
  stroke: {color: string, width: number};
}

interface BarChartOptions {
  chartType: ChartType;
  labelAxisProperty: string;
  valueAxisProperty: string;
  orientation: "horizontal" | "vertical";
  barPadding: number;
  barColor: string | string[] | StringOptionResolver;
}

interface ScatterPlotOptions {
  chartType: ChartType;
  xAxisProperty: string;
  yAxisProperty: string;
  markerSize: number | NumberOptionResolver;
  markerColor: string | string[] | StringOptionResolver;
}

interface PieChartOptions {
  chartType: ChartType;
  labelAxisProperty: string;
  valueAxisProperty: string;
  pieSectionColor: string | string[] | StringOptionResolver;
}

type ChartOptions = LineChartOptions | BarChartOptions | ScatterPlotOptions | PieChartOptions;

export {
  BarChartOptions,
  ChartOptions,
  ChartType,
  LineChartOptions,
  NumberOptionResolver,
  PieChartOptions,
  ScatterPlotOptions,
  StringOptionResolver,
};
