import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MdDialogRef } from "@angular/material";

@Component({
  selector: "user-preferences-dlg",
  styleUrls: ["./user-preferences.component.css"],
  templateUrl: "./user-preferences.component.html",
})
export class UserPreferencesComponent implements OnInit {
  public languageFormGroup: FormGroup;

  private locale: string;

  public constructor(private formBuilder: FormBuilder, private dlgRef: MdDialogRef<UserPreferencesComponent>) {}

  public ngOnInit(): void {

    this.locale = localStorage.getItem("localeId") || "en";

    this.languageFormGroup = this.formBuilder.group({
      language: this.locale,
    });
  }

  public onCloseDialog(): void {
    if (this.locale !== this.languageFormGroup.get("language").value) {
      localStorage.setItem("localeId", this.languageFormGroup.get("language").value);
      this.dlgRef.close(true);
    }
    this.dlgRef.close(false);
  }
}
