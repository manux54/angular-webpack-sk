import "core-js/client/shim.min";
import "zone.js";

import "hammerjs";

import { enableProdMode } from "@angular/core";
import {platformBrowser} from "@angular/platform-browser";

import "../styles/app.main.css";

// Following import will be resolved as one of the config file in app/config during webpack building
import { config } from "AppConfig";

// Following import will be generated by @ngtools/webpack during build.
import {AppModuleNgFactory} from "./ngfactory/app/app.module.ngfactory";

if (config.environment === "prod") {
  enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
