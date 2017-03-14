import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { NotificationsService } from "../../core";

@Component({
  styleUrls: ["./hello-world.component.less"],
  templateUrl: "./hello-world.component.html",
})
export class HelloWorldComponent {

  public sendNotificationForm: FormGroup;

  public constructor(
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.sendNotificationForm = this.formBuilder.group({
      notificationMessage: ["Hello World to all fellow Angular programmer", Validators.required],
      notificationTitle: ["Hello World", Validators.required],
      persistantNotification: true,
    });
  }

  public sendNotification(): void {
    if (this.sendNotificationForm.valid) {
      const title: string = this.sendNotificationForm.get("notificationTitle").value;
      const message: string = this.sendNotificationForm.get("notificationMessage").value;
      const persistant: boolean = this.sendNotificationForm.get("persistantNotification").value;

      this.notifications.notify(title, message, "Hello World", "/dashboard", persistant);
    }
  }
}
