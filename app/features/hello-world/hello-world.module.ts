import { NgModule } from "@angular/core";

import { HelloWorldRoutingModule, routedComponents } from "./hello-world-routing.module";

@NgModule({
  declarations: [routedComponents],
  imports: [HelloWorldRoutingModule],
})
export class HelloWorldModule { }
