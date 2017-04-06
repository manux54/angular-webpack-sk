import { Component } from "@angular/core";
import { BarChartOptions, LineChartOptions, ScatterPlotOptions } from "../../widgets/ng-chart";

@Component({
  styleUrls: ["./charts.component.less"],
  templateUrl: "./charts.component.html",
})
export class ChartsComponent {

  public family: any[] = [
    {
      age: 9,
      name: "Alexandre",
    },
    {
      age: 11,
      name: "Gabriel",
    },
    {
      age: 13,
      name: "Philippe",
    },
    {
      age: 39,
      name: "Sophie",
    },
    {
      age: 42,
      name: "Emmanuel",
    },
  ];

  public barChartOptions: BarChartOptions = {
    barColor: (d: any, i: number) => `rgb(${d.age * 5},0,0)`,
    barPadding: 2,
    chartType: "bar",
    labelAxisProperty: "name",
    orientation: "vertical",
    valueAxisProperty: "age",
  };

  public sales: any[] = [
    {
      month: 0,
      sales: 20,
    },
    {
      month: 1,
      sales: 14,
    },
    {
      month: 2,
      sales: 25,
    },
    {
      month: 3,
      sales: 22,
    },
    {
      month: 4,
      sales: 18,
    },
    {
      month: 5,
      sales: 1,
    },
    {
      month: 6,
      sales: 21,
    },
    {
      month: 7,
      sales: 20,
    },
    {
      month: 8,
      sales: 22,
    },
    {
      month: 9,
      sales: 15,
    },
    {
      month: 10,
      sales: 18,
    },
  ];

  public options: LineChartOptions = {
    chartType: "line",
    stroke: {
      color: "blue",
      width: 2,
    },
    xAxisProperty: "month",
    yAxisProperty: "sales",
  };

  public options2: BarChartOptions = {
    barColor: "red",
    barPadding: 4,
    chartType: "bar",
    labelAxisProperty: "month",
    orientation: "vertical",
    valueAxisProperty: "sales",
  };

  public options3: ScatterPlotOptions = {
    chartType: "scatterPlot",
    markerColor: "purple",
    markerSize: 5,
    xAxisProperty: "month",
    yAxisProperty: "sales",
  };
}
