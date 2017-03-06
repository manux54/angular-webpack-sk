import { NgModule } from "@angular/core";

import { DashboardRoutingModule, routedComponents } from "./dashboard-routing.module";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [routedComponents],
  imports: [DashboardRoutingModule, SharedModule],
})
export class DashboardModule { }
