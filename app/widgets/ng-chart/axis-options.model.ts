export class AxisOptions {
  public ticks: number = null;
  public title: string = null;
  public titleSize: number = 14;
  public gridLines: "major" | "minor" | null = null;
  public domain: number[] = null;
  public includesZero: boolean = true;

  // y-axis value only. ignored for x-axis
  public titleDirection: "Up" | "Down" = "Up";

  public constructor(init?: Partial<AxisOptions>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}
