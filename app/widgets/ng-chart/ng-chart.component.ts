import { Component, ElementRef, Input, OnInit } from "@angular/core";

import { axisBottom, axisLeft} from "d3-axis";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line } from "d3-shape";

import {
  BarChartOptions,
  ChartOptions,
  ChartType,
  LineChartOptions,
  NumberOptionResolver,
  PieChartOptions,
  ScatterPlotOptions,
  StringOptionResolver,
} from "./ng-chart.model";

@Component({
  selector: "ng-chart",
  styleUrls: ["./ng-chart.component.less"],
  templateUrl: "./ng-chart.component.html",
})
export class NgChartComponent implements OnInit {
  @Input() public chartTitle: string = "Chart";

  @Input() public dataSet: any[] = [];

  @Input() public width: number = 400;
  @Input() public height: number = 200;

  @Input() public padding: number | {bottom: number, left: number, right: number, top: number} = 20;

  @Input() public chartOptions: ChartOptions | ChartOptions[];

  private get paddingValue(): {bottom: number, left: number, right: number, top: number} {
    if (typeof(this.padding) === "number") {
      return {
        bottom: this.padding,
        left: this.padding,
        right: this.padding,
        top: this.padding,
      };
    } else {
      return this.padding;
    }
  }

  public constructor(private element: ElementRef) {}

  public ngOnInit(): void {
    const svg: Selection<any, any, null, undefined> = select(this.element.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    if (this.chartOptions instanceof Array) {
      this.chartOptions.forEach((chart: ChartOptions) => this.appendChart(svg, chart));
    } else {
      this.appendChart(svg, this.chartOptions);
    }
  }

  private appendChart(svg: Selection<any, any, null, undefined>, chart: ChartOptions): void {
    switch (chart.chartType) {
      case "bar":
        this.appendBarChart(svg, <BarChartOptions> chart);
        break;
      case "line":
        this.appendLineChart(svg, <LineChartOptions> chart);
        break;
      case "pie":
        this.appendPieChart(svg, <PieChartOptions> chart);
        break;
      case "scatterPlot":
        this.appendScatterPlot(svg, <ScatterPlotOptions> chart);
        break;
      default:
        break;
    }
  }

  private appendBarChart(svg: Selection<any, any, null, undefined>, chart: BarChartOptions): void {

    if (chart.orientation === "horizontal") {
      const valueScale = scaleLinear()
        .domain(this.getDomainRange(chart.valueAxisProperty, true))
        .range([this.paddingValue.left, this.width - this.paddingValue.right])
        .nice();

      svg.selectAll("rect")
        .data(this.dataSet)
        .enter()
        .append("rect")
        .attr("x", (d: any) => this.paddingValue.left)
        .attr("y", (d: any, i: number) => i * (this.height / this.dataSet.length))
        .attr("width", (d: any) => valueScale(d[chart.valueAxisProperty]))
        .attr("height", this.height / this.dataSet.length - chart.barPadding)
        .attr("fill", (d: any, i: number) => this.getString(chart.barColor, d, i));

    } else {
      const valueScale = scaleLinear()
        .domain(this.getDomainRange(chart.valueAxisProperty, true))
        .range([this.height - this.paddingValue.top, this.paddingValue.bottom])
        .nice();

      const width: number = this.width - this.paddingValue.left - this.paddingValue.right;

      svg.selectAll("rect")
        .data(this.dataSet)
        .enter()
        .append("rect")
        .attr("x", (d: any, i: number) => i * (width / this.dataSet.length) + this.paddingValue.left + chart.barPadding)
        .attr("y", (d: any) => valueScale(d[chart.valueAxisProperty]))
        .attr("width", width / this.dataSet.length - chart.barPadding * 2)
        .attr("height", (d: any) => this.height - valueScale(d[chart.valueAxisProperty]) - this.paddingValue.bottom)
        .attr("fill", (d: any, i: number) => this.getString(chart.barColor, d, i));

      svg.selectAll("text")
        .data(this.dataSet)
        .enter()
        .append("text")
        .text((d: any, i: number) => d[chart.labelAxisProperty])
        .attr("x", (d: any, i: number) => (i + 0.5) * (width / this.dataSet.length) + this.paddingValue.left)
        .attr("y", this.height - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .attr("font-weight", "bold");
    }
  }

  private appendLineChart(svg: Selection<any, any, null, undefined>, chart: LineChartOptions): void {
    const xScale = scaleLinear()
      .domain(this.getDomainRange(chart.xAxisProperty))
      .range([this.paddingValue.left, this.width - this.paddingValue.right])
      .nice();

    const yScale = scaleLinear()
      .domain(this.getDomainRange(chart.yAxisProperty, true))
      .range([this.height - this.paddingValue.top, this.paddingValue.bottom])
      .nice();

    const lineFct = line()
      .x((d: any) => xScale(d[chart.xAxisProperty]))
      .y((d: any) => yScale(d[chart.yAxisProperty]));

    svg.append("g")
      .call(axisLeft(yScale))
      .attr("class", "axis")
      .attr("transform", `translate(${this.paddingValue.left},0)`);

    svg.append("g")
      .call(axisBottom(xScale))
      .attr("class", "axis")
      .attr("transform", `translate(0,${this.height - this.paddingValue.bottom})`);

    svg.append("path")
      .attr("d", lineFct(this.dataSet))
      .attr("stroke", chart.stroke.color)
      .attr("stroke-width", chart.stroke.width)
      .attr("fill", "none");
  }

  private appendPieChart(svg: Selection<any, any, null, undefined>, chart: PieChartOptions): void {
    svg.append("h1").text("Pie Chart");
  }

  private appendScatterPlot(svg: Selection<any, any, null, undefined>, chart: ScatterPlotOptions): void {
    const xScale = scaleLinear()
      .domain(this.getDomainRange(chart.xAxisProperty))
      .range([this.paddingValue.left, this.width - this.paddingValue.right])
      .nice();

    const yScale = scaleLinear()
      .domain(this.getDomainRange(chart.yAxisProperty, true))
      .range([this.height - this.paddingValue.top, this.paddingValue.bottom])
      .nice();

    svg.append("g")
      .call(axisLeft(yScale))
      .attr("class", "axis")
      .attr("transform", `translate(${this.paddingValue.left},0)`);

    svg.append("g")
      .call(axisBottom(xScale))
      .attr("class", "axis")
      .attr("transform", `translate(0,${this.height - this.paddingValue.bottom})`);

    svg.selectAll("circle")
      .data(this.dataSet)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => xScale(d[chart.xAxisProperty]))
      .attr("cy", (d: any) => yScale(d[chart.yAxisProperty]))
      .attr("r", (d: any, i: number) => this.getNumber(chart.markerSize, d, i))
      .attr("fill", (d: any, i: number) => this.getString(chart.markerColor, d, i));
  }

  private getDomainRange(property: string, zeroRange: boolean = false): number[] {
    let min: number = zeroRange ? 0 : Number.POSITIVE_INFINITY;
    let max: number = zeroRange ? 0 : Number.NEGATIVE_INFINITY;

    this.dataSet.forEach((val: any) => {
      if (val[property] < min) {
        min = val[property];
      }

      if (val[property] > max) {
        max = val[property];
      }
    });
    return [min, max];
  }

  private getString(option: string | string[] | StringOptionResolver, d: any, i: number): string {
    if (typeof(option) === "string") {
      return option;
    } else if (option instanceof Array) {
      return option[i % option.length];
    } else {
      return option(d, i);
    }
  }

  private getNumber(option: number | NumberOptionResolver, d: any, i: number): number {
    if (typeof(option) === "number") {
      return option;
    } else {
      return option(d, i);
    }
  }
}
