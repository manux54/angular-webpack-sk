import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HelloWorldComponent } from "./hello-world.component";

const routes: Routes = [
  {
    component: HelloWorldComponent,
    path: "",
   },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class HelloWorldRoutingModule { }

export const routedComponents = [HelloWorldComponent];
