import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { NavbarModule } from "./navbar/navbar.module";
import { NotificationsModule } from "./notifications/notifications.module";

import { loadedModuleImportGuard } from "./module-import.guard";

@NgModule({
  exports: [
    CommonModule,
    NavbarModule,
    NotificationsModule,
  ],
  imports: [
    CommonModule,
    NavbarModule,
    NotificationsModule,
  ],
})
export class CoreModule {
  public constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    loadedModuleImportGuard(parentModule, "CoreModule");
  }
}
