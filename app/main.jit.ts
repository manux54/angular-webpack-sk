import "core-js/client/shim.min";
import "zone.js";

import "hammerjs";

import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {AppModule} from "./app.module";

import { i18nProviders } from "i18n-providers";

import "../styles/app.main.css";

// Following import will be resolved as one of the config file in app/config during webpack building
import { config } from "AppConfig";

platformBrowserDynamic().bootstrapModule(AppModule, { providers: i18nProviders });
