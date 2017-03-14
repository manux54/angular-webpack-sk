import { NgModule } from "@angular/core";

import { HelloWorldRoutingModule, routedComponents } from "./hello-world-routing.module";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [routedComponents],
  imports: [HelloWorldRoutingModule, SharedModule],
})
export class HelloWorldModule { }
