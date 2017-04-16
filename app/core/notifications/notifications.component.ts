import { AnimationTransitionEvent, Component, ElementRef, HostListener } from "@angular/core";
import { MdSnackBar, MdSnackBarRef } from "@angular/material";
import { Router } from "@angular/router";

import { Notification } from "./notification.model";
import { notificationsAnimations } from "./notifications-animations";
import { NotificationsService } from "./notifications.service";

@Component({
  animations: notificationsAnimations,
  selector: "my-notifications",
  styleUrls: ["./notifications.component.less"],
  templateUrl: "./notifications.component.html",
})
export class NotificationsComponent {
  public get newCount(): number {
    return this.notifications.filter((val) => val.isNew).length;
  }

  public groups: string[] = [];

  public notificationPaneState: "active" | "hidden" = "hidden";

  private notifications: Notification[] = [];
  private pendingNotifications: Notification[] = [];

  private snackbarShowing: boolean = false;

  public constructor(
    private snackbar: MdSnackBar,
    private router: Router,
    private notificationsService: NotificationsService,
    private element: ElementRef,
  ) {
    notificationsService.notify = this.notify.bind(this);
  }

  public notify(title: string, text: string, group: string, route: string, persist: boolean): void {

    const notification: Notification = new Notification(title, text, group, route);
    this.pendingNotifications.push(notification);
    this.showPendingSnackbar();

    if (persist) {
      if (this.groups.findIndex((val) => val === group) === -1) {
        this.groups.push(group);
      }
      this.notifications.push(notification);
    }
  }

  public getGroupNotifications(group: string): Notification[] {
    return this.notifications.filter((val) => val.group === group);
  }

  public onNotificationBadgeClick(event: MouseEvent): void {
    this.notificationPaneState = (this.notificationPaneState === "hidden") ? "active" : "hidden";
  }

  public onNotificationClicked(notification: Notification) {
    if (notification.route) {
      this.router.navigate([notification.route]);
    }
  }

  public onDeleteClicked(notification: Notification, event: MouseEvent): void {
    let idx = this.notifications.findIndex((val) => val === notification);

    if (idx !== -1) {
      this.notifications.splice(idx, 1);

      if (this.notifications.findIndex((val) => val.group === notification.group) === -1) {
        idx = this.groups.findIndex((val) => val === notification.group);

        if (idx !== -1) {
          this.groups.splice(idx, 1);
        }
      }
    }

    if (event) {
      event.stopPropagation();
    }
  }

  public onNotificationPaneStateChanged(event: AnimationTransitionEvent) {
    switch (event.toState) {
      case "hidden":
        this.notifications.forEach((val: Notification) => val.hasBeenRead());
        break;
      case "active":
        this.pendingNotifications = [];
        break;
      default:
        break;
    }
  }

  public onNotificationToggleClick(notification: Notification, event: MouseEvent): void {
    notification.toggleOpen();
    event.stopPropagation();
  }

  @HostListener("document:click", ["$event"])
  public onClick(event: MouseEvent): void {
    if (this.notificationPaneState === "active" && !this.element.nativeElement.contains(event.target)) {
      this.notificationPaneState = "hidden";
    }
  }

  private showPendingSnackbar(): void {
    if (!this.snackbarShowing && this.pendingNotifications.length) {
      this.snackbarShowing = true;
      const notification: Notification = this.pendingNotifications.pop();

      const ref = this.snackbar.open(notification.text, notification.route ? "Open" : null, {duration: 3000});
      ref.onAction().subscribe(() => this.router.navigate([notification.route]));
      ref.afterDismissed().subscribe(() => this.showPendingSnackbar());
    } else {
      this.snackbarShowing = false;
    }
  }
}
