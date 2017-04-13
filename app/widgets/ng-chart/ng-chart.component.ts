import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";

import { axisBottom, axisLeft } from "d3-axis";
import { format, formatPrefix } from "d3-format";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line } from "d3-shape";

import {
  ChartOptions,
  ChartType,
  NumberOptionResolver,
  StringOptionResolver,
} from "./ng-chart.model";

@Component({
  selector: "ng-chart",
  styleUrls: ["./ng-chart.component.less"],
  templateUrl: "./ng-chart.component.html",
})
export class NgChartComponent implements OnInit {
  @Input() public title: string = null;
  @Input() public subTitle: string = null;

  @Input() public dataSet: any[] = [];

  @Input() public width: number = 400;
  @Input() public height: number = 200;

  @Input() public padding: number | {bottom: number, left: number, right: number, top: number} = 20;

  @Input() public chartOptions: ChartOptions | ChartOptions[] = new ChartOptions();

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
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.paddingValue.left}, ${this.paddingValue.right})`);

    if (this.chartOptions instanceof Array) {
      this.chartOptions.forEach((opt: ChartOptions) => this.appendChart(svg, opt));
    } else {
      this.appendChart(svg, this.chartOptions);
    }
  }

  private appendChart(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {
    switch (option.chartType) {
      case "bar":
        this.appendBarChart(svg, option);
        break;
      case "line":
        this.appendLineChart(svg, option);
        break;
      case "pie":
        this.appendPieChart(svg, option);
        break;
      case "scatterPlot":
        this.appendScatterPlot(svg, option);
        break;
      default:
        break;
    }
  }

  private appendBarChart(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    if (option.orientation === "horizontal") {
      const valueScale = scaleLinear()
        .domain(this.getDomainRange(option.xAxisProperty, true))
        .range([0, width])
        .nice();

      svg.selectAll("rect")
        .data(this.dataSet)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d: any, i: number) => i * (height / this.dataSet.length))
        .attr("width", (d: any) => valueScale(d[option.xAxisProperty]))
        .attr("height", height / this.dataSet.length - option.padding)
        .attr("fill", (d: any, i: number) => this.getString(option.fill, d, i));

    } else {
      const valueScale = scaleLinear()
        .domain(this.getDomainRange(option.yAxisProperty, true))
        .range([height, 0])
        .nice();

      svg.selectAll("rect")
        .data(this.dataSet)
        .enter()
        .append("rect")
        .attr("x", (d: any, i: number) => i * (width / this.dataSet.length) + option.padding)
        .attr("y", (d: any) => valueScale(d[option.yAxisProperty]))
        .attr("width", width / this.dataSet.length - option.padding * 2)
        .attr("height", (d: any) => height - valueScale(d[option.yAxisProperty]))
        .attr("fill", (d: any, i: number) => this.getString(option.fill, d, i));

      svg.append("g")
        .attr("class", "axis")
        .selectAll("text")
        .data(this.dataSet)
        .enter()
        .append("text")
        .text((d: any, i: number) => d[option.xAxisProperty])
        .attr("x", (d: any, i: number) => (i + 0.5) * (width / this.dataSet.length))
        .attr("y", height + this.paddingValue.bottom - 5)
        .attr("text-anchor", "middle");
    }
  }

  private appendLineChart(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    let xScale = scaleLinear()
      .domain(this.getDomainRange(option.xAxisProperty))
      .range([0, width]);

    if (!option.xAxisTicks) {
      xScale = xScale.nice();
    }

    let yScale = scaleLinear()
      .domain(this.getDomainRange(option.yAxisProperty, true))
      .range([height, 0]);

    if (!option.yAxisTicks) {
      yScale = yScale.nice();
    }

    const lineFct = line()
      .x((d: any) => xScale(d[option.xAxisProperty]))
      .y((d: any) => yScale(d[option.yAxisProperty]));

    let yAxis = axisLeft(yScale).ticks(option.yAxisTicks);

    // TODO : Move formating to configuration options
    yAxis = yAxis.tickFormat(formatPrefix(",.0", 1e3));

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    if (option.yAxisGridLines) {
      const ticks: number[] = [];
      let prevTick: number = null;

      yScale.ticks(option.yAxisTicks).forEach((tick: number) => {
        if (prevTick !== null && option.yAxisGridLines === "minor") {
          ticks.push(yScale((prevTick + tick) / 2));
        }
        ticks.push(yScale(tick));
        prevTick = tick;
      });

      svg.append("g")
        .attr("class", "grid-lines y-axis " + option.yAxisGridLines)
        .selectAll("lines")
        .data(ticks)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", (d: number) => d)
        .attr("y2", (d: number) => d);
    }

    svg.append("g")
      .call(axisBottom(xScale).ticks(option.xAxisTicks))
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${height})`);

    if (option.xAxisGridLines) {
      const ticks: number[] = [];
      let prevTick: number = null;

      xScale.ticks(option.xAxisTicks).forEach((tick: number) => {
        if (prevTick !== null && option.xAxisGridLines === "minor") {
          ticks.push(xScale((prevTick + tick) / 2));
        }
        ticks.push(xScale(tick));
        prevTick = tick;
      });

      svg.append("g")
        .attr("class", "grid-lines x-axis " + option.xAxisGridLines)
        .selectAll("lines")
        .data(ticks)
        .enter()
        .append("line")
        .attr("x1", (d: number) => d)
        .attr("x2", (d: number) => d)
        .attr("y1", 0)
        .attr("y2", height);
    }

    if (option.xAxisTitle) {
      svg.append("text")
        .text(option.xAxisTitle)
        .attr("x", width / 2)
        .attr("y", height + this.paddingValue.bottom) // Replace padding by axis height + fontSize + label padding
        .attr("font-size", option.axisTitleSize)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label, x-axis");
    }

    if (option.yAxisTitle) {
      const yOrigin: number = height / 2;

      const xOrigin: number = option.yAxisTitleDirection === "Up" ?
        option.axisTitleSize - this.paddingValue.left : -this.paddingValue.left;

      const rotation: number = option.yAxisTitleDirection === "Up" ? -90 : 90;

      svg.append("text")
        .text(option.yAxisTitle)
        .attr("font-size", option.axisTitleSize)
        .attr("transform", `translate(${xOrigin},${yOrigin}) rotate(${rotation})`)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label y-axis");
    }

    if (option.stroke) {
      svg.append("path")
        .attr("d", lineFct(this.dataSet))
        .attr("stroke", (d: any, i: number) => this.getString(option.stroke, d, i))
        .attr("stroke-width", option.strokeWidth)
        .attr("fill", "none")
        .attr("class", "chart-line" + (option.class ? (" " + option.class) : ""));
    }

    if (option.markerSize) {
      svg.selectAll("circle")
        .data(this.dataSet)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => xScale(d[option.xAxisProperty]))
        .attr("cy", (d: any) => yScale(d[option.yAxisProperty]))
        .attr("r", (d: any, i: number) => this.getNumber(option.markerSize, d, i))
        .attr("fill", (d: any, i: number) => option.fill ? this.getString(option.fill, d, i) : "black");
    }
  }

  private appendPieChart(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {
    svg.append("h1").text("Pie Chart");
  }

  private appendScatterPlot(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {
    const xScale = scaleLinear()
      .domain(this.getDomainRange(option.xAxisProperty))
      .range([this.paddingValue.left, this.width - this.paddingValue.right])
      .nice();

    const yScale = scaleLinear()
      .domain(this.getDomainRange(option.yAxisProperty, true))
      .range([this.height - this.paddingValue.top, this.paddingValue.bottom])
      .nice();

    svg.append("g")
      .call(axisLeft(yScale).ticks(5))
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${this.paddingValue.left},0)`);

    svg.append("g")
      .call(axisBottom(xScale))
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${this.height - this.paddingValue.bottom})`);

    svg.selectAll("circle")
      .data(this.dataSet)
      .enter()
      .append("circle")
      .attr("cx", (d: any) => xScale(d[option.xAxisProperty]))
      .attr("cy", (d: any) => yScale(d[option.yAxisProperty]))
      .attr("r", (d: any, i: number) => this.getNumber(option.markerSize, d, i))
      .attr("fill", (d: any, i: number) => this.getString(option.fill, d, i));
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
