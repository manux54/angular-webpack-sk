import { Component } from "@angular/core";
import { MdDialog, MdDialogRef } from "@angular/material";

import { UserPreferencesComponent } from "../../widgets/preferences/user-preferences.component";

@Component({
  selector: "my-navbar",
  styleUrls: ["./navbar.component.less"],
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {

  public constructor(private dialog: MdDialog) {}

  public onUserPreferenceClicked() {
    const dialogRef: MdDialogRef<UserPreferencesComponent> = this.dialog.open(UserPreferencesComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => location.reload(), 1);
      }
    });
  }
}
