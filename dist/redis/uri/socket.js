"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errors_1 = require("../../errors");
const uri_1 = require("../../uri");
exports.parse = (uri) => {
    const protocol = uri_1.getScheme(uri);
    if (protocol !== uri_1.Scheme.RedisSocket
        && protocol !== uri_1.Scheme.RedisSocketSecure) {
        throw new errors_1.ParseError(`unrecognized scheme "${protocol}"`);
    }
    const parsed = uri_1.parseUri(uri);
    const path = parsed.path;
    return Object.assign({ path: validatePath(path), protocol }, common_1.parseRedisQuery(parsed));
};
const validatePath = (path) => {
    if (/^[^\0]+$/.test(path) !== true) {
        throw new errors_1.ParseError(`invalid path "${path}"`);
    }
    return path;
};
//# sourceMappingURL=socket.js.map