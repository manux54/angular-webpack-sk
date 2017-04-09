type StringOptionResolver = (data: any, index: number) => string;
type NumberOptionResolver = (data: any, index: number) => number;

type ChartType = "line" | "bar" | "scatterPlot" | "pie";

class ChartOptions {
  public chartType: ChartType = "line";
  public xAxisProperty: string = "x";
  public yAxisProperty: string = "y";
  public orientation: "horizontal" | "vertical" = "horizontal";
  public stroke: string | string[] | StringOptionResolver = null;
  public strokeWidth: number = 1;
  public fill: string | string[] | StringOptionResolver = null;
  public markerSize: number | NumberOptionResolver = null;
  public padding: number;
  public xAxisTicks: number = null;
  public yAxisTicks: number = null;

  public constructor(init?: Partial<ChartOptions>) {
    if (init) {
      Object.assign(this, init);
    }
  }
};

export {
  ChartOptions,
  ChartType,
  NumberOptionResolver,
  StringOptionResolver,
};
