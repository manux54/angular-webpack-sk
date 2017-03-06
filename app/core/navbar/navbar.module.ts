import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from "./navbar.component";

import { SharedModule } from "../../shared/shared.module";
import { UserPreferencesComponent } from "../../widgets/preferences/user-preferences.component";

import { loadedModuleImportGuard } from "../module-import.guard";

@NgModule({
  declarations: [
    NavbarComponent,
    UserPreferencesComponent,
  ],
  entryComponents: [
    UserPreferencesComponent,
  ],
  exports: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
})
export class NavbarModule {
    public constructor( @Optional() @SkipSelf() parentModule: NavbarModule) {
        loadedModuleImportGuard(parentModule, "NavbarModule");
    }
}
