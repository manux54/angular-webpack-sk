import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  {
    component: DashboardComponent,
    path: "",
   },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class DashboardRoutingModule { }

export const routedComponents = [DashboardComponent];
