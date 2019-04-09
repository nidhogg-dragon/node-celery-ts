"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JsYaml = require("js-yaml");
exports.createJsonSerializer = () => ({
    serialize: (data) => Buffer.from(JSON.stringify(data), "utf8"),
    deserialize: (data) => JSON.parse(data.toString("utf8")),
});
exports.createYamlSerializer = () => ({
    serialize: (data) => Buffer.from(JsYaml.safeDump(data), "utf8"),
    deserialize: (data) => JsYaml.safeLoad(data.toString("utf8")),
});
//# sourceMappingURL=serializer.js.map