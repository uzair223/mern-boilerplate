const { escape } = require("querystring");

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
String.prototype.toPascalCase = function () {
  return this.toTitleCase().replace(/\s+/g, "");
};

toQueryString = function (data, nesting = "") {
  return Object.entries(data)
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        return val.map(subVal => [nesting + key, subVal].map(escape).join("=")).join("&");
      } else if (typeof val === "object") {
        return toQueryString(val, nesting + `${key}.`);
      } else {
        return [nesting + key, val].map(escape).join("=");
      }
    })
    .join("&");
};
