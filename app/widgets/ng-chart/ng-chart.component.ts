import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from "@angular/core";

import { Axis, axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";
import { format, formatPrefix } from "d3-format";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line } from "d3-shape";

import { AxisOptions } from "./axis-options.model";

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

  @Input() public axes: {[axis: string]: AxisOptions} = {
    bottom: new AxisOptions(),
    left: new AxisOptions(),
  };

  private scales: {[axis: string]: ScaleLinear<number, number> } = {};
  private domains: {[axis: string]: number[]} = {};

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

  private get chartOptionsValue(): ChartOptions[] {
    return (this.chartOptions instanceof Array) ? this.chartOptions : [this.chartOptions];
  }

  public constructor(private element: ElementRef) {}

  public ngOnInit(): void {
    const svg: Selection<any, any, null, undefined> = select(this.element.nativeElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.paddingValue.left}, ${this.paddingValue.right})`);

    this.appendAxes(svg);

    if (this.chartOptions instanceof Array) {
      this.chartOptions.forEach((opt: ChartOptions) => this.appendChart(svg, opt));
    } else {
      this.appendChart(svg, this.chartOptions);
    }
  }

  private getScale(axis: string): ScaleLinear<number, number> {

    if (this.scales[axis]) {
      return this.scales[axis];
    }

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    const domain: number[] = this.getDomainRange(axis);

    // domain will be null if no charts is mapped to specified axis
    if (!domain) {
      return null;
    }

    const options: AxisOptions = this.axes[axis];
    const xAxis: boolean = axis === "bottom" || axis === "top" || axis === "hidden-x";
    const range: number[] = xAxis ? [0, width] : [height, 0];

    const scale: ScaleLinear<number, number> = scaleLinear()
      .domain(domain)
      .range(range)
      .nice(options.ticks);

    return this.scales[axis] = scale;
  }

  private getDomainRange(axis: string): number[] {

    if (this.domains[axis]) {
      return this.domains[axis];
    }

    let min: number = Number.POSITIVE_INFINITY;
    let max: number = Number.NEGATIVE_INFINITY;

    if (axis === "hidden-x" || axis === "hidden-y" ) {
      min = max = 0;
    } else {
      const options: AxisOptions = this.axes[axis];

      if (!options) {
        return null;
      }

      if (options.domain && options.domain.length === 2) {
        return this.domains[axis] = options.domain;
      }

      if (options.includesZero) {
        min = max = 0;
      }
    }

    this.chartOptionsValue.forEach((option: ChartOptions) => {

      let property: string = null;
      if (option.xAxis === axis || axis === "hidden-x") {
        property = option.xAxisProperty;
      } else if (option.yAxis === axis || axis === "hidden-y") {
        property = option.yAxisProperty;
      }

      if (property) {
        this.dataSet.forEach((val: any) => {
          if (val[property] < min) {
            min = val[property];
          }

          if (val[property] > max) {
            max = val[property];
          }
        });
      }
    });

    return min < max ? this.domains[axis] = [min, max] : null;
  }

  private appendAxes(svg: Selection<any, any, null, undefined>): void {
    const validAxes: string[] = ["bottom", "left", "right", "top" ];

    for (const axis in this.axes) {
      if (this.axes[axis] && validAxes.findIndex((val: string) => val === axis) !== -1 ) {
        this.appendAxis(svg, axis);
      }
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
      default:
        break;
    }
  }

  private appendBarChart(svg: Selection<any, any, null, undefined>, option: ChartOptions): void {

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    if (option.orientation === "horizontal") {
      const valueScale = scaleLinear()
        .domain(this.getDomainRange("hidden-x"))
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
        .domain(this.getDomainRange("hidden-y"))
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

  private appendAxis( svg: Selection<any, any, null, undefined>, axis: string ): ScaleLinear<number, number> {

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    const scale: ScaleLinear<number, number> = this.getScale(axis);

    if (!scale) {
      return null;
    }

    const options: AxisOptions = this.axes[axis];

    let axisInstance: Axis<{}> = null;
    let transform: string = null;

    switch (axis) {
      case "left":
        axisInstance = axisLeft(scale);
        break;
      case "right":
        axisInstance = axisRight(scale);
        transform = `translate(${width},0)`;
        break;
      case "top":
        axisInstance = axisTop(scale);
        break;
      default:
        axisInstance = axisBottom(scale);
        transform = `translate(0,${height})`;
        break;
    }

    axisInstance = axisInstance.ticks(options.ticks);

    // TODO : Move formating to configuration options
    if (axis === "left" || axis === "right") {
      axisInstance = axisInstance.tickFormat(formatPrefix(",.0", 1e3));
    }

    if (transform) {
      svg.append("g")
      .attr("class", "axis " + axis)
      .attr("transform", transform)
      .call(axisInstance);
    } else {
    svg.append("g")
      .attr("class", "axis " + axis)
      .call(axisInstance);
    }

    if (options.gridLines) {
      const ticks: number[] = [];
      let prevTick: number = null;

      scale.ticks(options.ticks).forEach((tick: number) => {
        if (prevTick !== null && options.gridLines === "minor") {
          ticks.push(scale((prevTick + tick) / 2));
        }
        ticks.push(scale(tick));
        prevTick = tick;
      });

      const xAxis: boolean = axis === "bottom" || axis === "top";

      svg.append("g")
        .attr("class", `grid-lines ${axis} ${options.gridLines}`)
        .selectAll("lines")
        .data(ticks)
        .enter()
        .append("line")
        .attr("x1", (d: number) => xAxis ? d : 0)
        .attr("x2", (d: number) => xAxis ? d : width)
        .attr("y1", (d: number) => xAxis ? 0 : d)
        .attr("y2", (d: number) => xAxis ? height : d);
    }

    if (options.title) {
      let x: number;
      let y: number;
      let rotation: number = null;

      switch (axis) {
        case "left":
          x = options.titleDirection === "Up" ? options.titleSize - this.paddingValue.left : -this.paddingValue.left;
          y = height / 2;
          rotation = options.titleDirection === "Up" ? -90 : 90;
          break;
        case "right":
          x = width - this.paddingValue.right;
          y = height / 2;
          rotation = options.titleDirection === "Up" ? -90 : 90;
          break;
        case "top":
          x = width / 2;
          y = options.titleSize - this.paddingValue.top;
          break;
        case "bottom":
        default:
          x = width / 2;
          y = height + this.paddingValue.bottom;
          break;
      }

      const axisLabel = svg.append("text")
          .text(options.title)
          .attr("font-size", options.titleSize)
          .attr("text-anchor", "middle")
          .attr("class", `axis-label ${axis}`);

      if (rotation) {
        axisLabel.attr("transform", `translate(${x}, ${y}) rotate(${rotation})`);
      } else {
          axisLabel.attr("x", x).attr("y", y);
      }
    }

    return scale;
  }

  private appendLineChart(
    svg: Selection<any, any, null, undefined>,
    option: ChartOptions,
  ): void {

    const width = this.width - this.paddingValue.left - this.paddingValue.right;
    const height = this.height - this.paddingValue.top - this.paddingValue.bottom;

    const xScale = this.getScale(option.xAxis);
    const yScale = this.getScale(option.yAxis);

    const lineFct = line()
      .x((d: any) => xScale(d[option.xAxisProperty]))
      .y((d: any) => yScale(d[option.yAxisProperty]));

    const svgChart = svg.append("g")
        .attr("class", "chart-line" + (option.class ? (" " + option.class) : ""));

    if (option.stroke) {
      svgChart.append("path")
        .attr("d", lineFct(this.dataSet))
        .attr("stroke", (d: any, i: number) => this.getString(option.stroke, d, i))
        .attr("stroke-width", option.strokeWidth)
        .attr("fill", "none");
    }

    if (option.markerSize) {
      svgChart.selectAll("circle")
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
