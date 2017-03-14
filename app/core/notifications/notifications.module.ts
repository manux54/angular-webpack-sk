import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { NotificationsComponent } from "./notifications.component";
import { NotificationsService } from "./notifications.service";

import { loadedModuleImportGuard } from "../module-import.guard";

import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent],
  imports: [CommonModule, SharedModule],
  providers: [NotificationsService],
})
export class NotificationsModule {
  public constructor( @Optional() @SkipSelf() parentModule: NotificationsModule) {
    loadedModuleImportGuard(parentModule, "NotificationsModule");
  }
}
