import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";

@NgModule({
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule { }
