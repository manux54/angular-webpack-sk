import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ChartsComponent } from "./charts.component";

const routes: Routes = [
  {
    component: ChartsComponent,
    path: "",
   },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ChartsRoutingModule { }

export const routedComponents = [ChartsComponent];
