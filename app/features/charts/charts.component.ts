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
      frank: 20000,
      jake: 18000,
      month: 0,
    },
    {
      frank: 14000,
      jake: 19000,
      month: 1,
    },
    {
      frank: 25000,
      jake: 20000,
      month: 2,
    },
    {
      frank: 22000,
      jake: 17000,
      month: 3,
    },
    {
      frank: 18000,
      jake: 21000,
      month: 4,
    },
    {
      frank: 1000,
      jake: 24000,
      month: 5,
    },
    {
      frank: 21000,
      jake: 6000,
      month: 6,
    },
    {
      frank: 20000,
      jake: 8000,
      month: 7,
    },
    {
      frank: 22000,
      jake: 18000,
      month: 8,
    },
    {
      frank: 15000,
      jake: 19000,
      month: 9,
    },
    {
      frank: 18000,
      jake: 18000,
      month: 10,
    },
  ];

  public frankSales: ChartOptions = new ChartOptions({
    chartType: "line",
    fill: "blue",
    markerSize: 5,
    stroke: "blue",
    strokeWidth: 2,
    xAxis: "bottom",
    xAxisProperty: "month",
    yAxis: "left",
    yAxisProperty: "frank",
  });

  public jakeSales: ChartOptions = new ChartOptions({
    chartType: "line",
    fill: "red",
    markerSize: 5,
    stroke: "red",
    strokeWidth: 2,
    xAxis: "bottom",
    xAxisProperty: "month",
    yAxis: "left",
    yAxisProperty: "jake",
  });

  public axes: {[axis: string]: AxisOptions} = {
    bottom: new AxisOptions({
      gridLines: "minor",
      title: "Months",
    }),
    left: new AxisOptions({
      gridLines: "major",
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
