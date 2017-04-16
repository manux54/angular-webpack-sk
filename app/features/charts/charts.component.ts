import { Component, ViewEncapsulation } from "@angular/core";
import { AxisOptions, ChartOptions } from "../../widgets/ng-chart";

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

  public barChartOptions: ChartOptions = new ChartOptions({
    chartType: "bar",
    fill: (d: any, i: number) => `rgb(${d.age * 5},0,0)`,
    orientation: "vertical",
    padding: 2,
    xAxis: "hidden-x",
    xAxisProperty: "name",
    yAxis: "hidden-y",
    yAxisProperty: "age",
  });

  public sales: any[] = [
    {
      month: 0,
      sales: 20000,
    },
    {
      month: 1,
      sales: 14000,
    },
    {
      month: 2,
      sales: 25000,
    },
    {
      month: 3,
      sales: 22000,
    },
    {
      month: 4,
      sales: 18000,
    },
    {
      month: 5,
      sales: 1000,
    },
    {
      month: 6,
      sales: 21000,
    },
    {
      month: 7,
      sales: 20000,
    },
    {
      month: 8,
      sales: 22000,
    },
    {
      month: 9,
      sales: 15000,
    },
    {
      month: 10,
      sales: 18000,
    },
  ];

  public options: ChartOptions = new ChartOptions({
    chartType: "line",
    markerSize: 5,
    stroke: "blue",
    strokeWidth: 2,
    xAxis: "bottom",
    xAxisProperty: "month",
    yAxis: "left",
    yAxisProperty: "sales",
  });

  public axes: {[axis: string]: AxisOptions} = {
    bottom: new AxisOptions({
      gridLines: "minor",
      title: "Months",
    }),
    left: new AxisOptions({
      gridLines: "minor",
      ticks: 5,
      title: "Sales",
    }),
  };

  public lineChartPadding = {
    bottom: 34,
    left: 44,
    right: 20,
    top: 20,
  };

  public options2: ChartOptions = new ChartOptions({
    chartType: "bar",
    fill: "red",
    orientation: "vertical",
    padding: 4,
    xAxisProperty: "month",
    yAxisProperty: "sales",
  });
}
