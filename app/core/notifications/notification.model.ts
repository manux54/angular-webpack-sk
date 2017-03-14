export class Notification {
  public group: string;
  public title: string;
  public text: string;
  public route: string;

  public get notificationDate(): Date {
    return this.notificationDateValue;
  }

  public get isNew() {
    return !this.read;
  }

  public get isOpened() {
    return this.opened;
  }

  private read: boolean = false;
  private opened: boolean = false;
  private notificationDateValue: Date = null;

  public constructor(title: string, text: string, group: string = null, route: string = null) {
    this.group = group;
    this.title = title;
    this.text = text;
    this.read = false;
    this.notificationDateValue = new Date();
    this.route = route;
  }

  public hasBeenRead(): void {
    this.read = true;
  }

  public toggleOpen(): void {
    this.opened = !this.opened;
  }
}
