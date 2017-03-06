function injectScripts(src) {
  var script = document.createElement("script");
  script.src = src;
  script.type = "text/javascript";
  document.body.appendChild(script);
}

var locale = localStorage.getItem("localeId") || "en";

injectScripts(`dist/app.${locale}.js`);
