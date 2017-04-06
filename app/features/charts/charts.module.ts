import { NgModule } from "@angular/core";

import { ChartsRoutingModule, routedComponents } from "./charts-routing.module";

import { NgChartComponent } from "../../widgets/ng-chart/ng-chart.component";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [routedComponents, NgChartComponent],
  imports: [ChartsRoutingModule, SharedModule],
})
export class ChartsModule { }
