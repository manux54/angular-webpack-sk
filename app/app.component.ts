import { Component } from "@angular/core";

import { config } from "AppConfig";

@Component({
  selector: "my-app",
  styleUrls: ["./app.component.less"],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  public greeting: string = "Hello Angular from AppComponent";
  public environment: string = config.environment;
}
