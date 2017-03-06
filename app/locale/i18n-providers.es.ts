import { LOCALE_ID, TRANSLATIONS, TRANSLATIONS_FORMAT} from "@angular/core";

import * as translationsTable from "./messages.es.xlf";

export const i18nProviders = [
  {provide: TRANSLATIONS, useValue: translationsTable},
  {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
  {provide: LOCALE_ID, useValue: "es"},
];
