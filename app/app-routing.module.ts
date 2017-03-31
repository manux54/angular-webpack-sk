import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    loadChildren: "./features/dashboard/dashboard.module#DashboardModule",
    path: "dashboard",
  },
  {
    loadChildren: "./features/hello-world/hello-world.module#HelloWorldModule",
    path: "helloworld",
  },
  {
    loadChildren: "./features/charts/charts.module#ChartsModule",
    path: "charts",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
})
export class AppRoutingModule { }
