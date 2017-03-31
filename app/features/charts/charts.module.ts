import { NgModule } from "@angular/core";

import { ChartsRoutingModule, routedComponents } from "./charts-routing.module";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [routedComponents],
  imports: [ChartsRoutingModule, SharedModule],
})
export class ChartsModule { }
