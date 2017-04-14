type StringOptionResolver = (data: any, index: number) => string;
type NumberOptionResolver = (data: any, index: number) => number;

// Chart Types:
// 1) Line for line, area charts and scatter plots
// 2) Bar for bar charts and histograms
// 3) Pie for pie and radial charts
type ChartType = "line" | "bar" | "pie";

class ChartOptions {
  public chartType: ChartType = "line";

  // x-axis configs. Defaults to x property of dataset, defaults d3 ticks, no axis title, no grid lines,
  // automatic domain and force 0 inside domain range
  public xAxisProperty: string = "x";
  public xAxisTicks: number = null;
  public xAxisTitle: string = null;
  public xAxisGridLines: "major" | "minor" | null = null;
  public xAxisDomain: number[] = null;
  public xAxisIncludesZero: boolean = true;

  // y-axis configs. Defaults to y property of dataset, defaults d3 ticks, no axis title, no grid lines
  // automatic domain and force 0 inside domain range
  public yAxisProperty: string = "y";
  public yAxisTicks: number = null;
  public yAxisTitle: string = null;
  public yAxisGridLines: "major" | "minor" = null;
  public yAxisTitleDirection: "Up" | "Down" = "Up";
  public yAxisDomain: number[] = null;
  public yAxisIncludesZero: boolean = true;

  // bar chart config: default to vertical bars
  public orientation: "horizontal" | "vertical" = "vertical";
  public padding: number;

  // line chart config. 1 pixel wide black line
  public stroke: string | string[] | StringOptionResolver = null;
  public strokeWidth: number = 1;

  // Scatter plot options: defaults to black markers
  public markerSize: number | NumberOptionResolver = null;
  public fill: string | string[] | StringOptionResolver = null;

  // Css class for the graph. Defaults to no special class
  public class: string = null;

  // Axis title size. Default to 14. Remove and assume custom size will be set from CSS?
  public axisTitleSize: number = 14;

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
