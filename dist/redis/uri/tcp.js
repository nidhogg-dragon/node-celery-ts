"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errors_1 = require("../../errors");
const uri_1 = require("../../uri");
const utility_1 = require("../../utility");
const _ = require("underscore");
exports.parse = (rawUri) => {
    const protocol = uri_1.getScheme(rawUri);
    if (protocol !== uri_1.Scheme.Redis && protocol !== uri_1.Scheme.RedisSecure) {
        throw new errors_1.ParseError(`unrecognized scheme "${protocol}"`);
    }
    const parsed = uri_1.parseUri(rawUri);
    if (utility_1.isNullOrUndefined(parsed.authority)) {
        throw new errors_1.ParseError(`"${rawUri}" is missing authority`);
    }
    const rawOptions = addOptions(parsed, { protocol });
    return Object.assign({}, rawOptions, common_1.parseRedisQuery(parsed));
};
var Option;
(function (Option) {
    Option["Database"] = "db";
    Option["Hostname"] = "host";
    Option["Password"] = "password";
    Option["Port"] = "port";
})(Option || (Option = {}));
const addOptions = (uri, options) => _.reduce(_.values(Option), (iterating, key) => {
    switch (key) {
        case Option.Database:
            return addDatabase(uri, iterating);
        case Option.Hostname:
            return addHostname(uri, iterating);
        case Option.Password:
            return addPassword(uri, iterating);
        case Option.Port:
            return addPort(uri, iterating);
    }
}, options);
const addDatabase = (uri, iterating) => {
    if (uri.path === "/") {
        return iterating;
    }
    return Object.assign({}, iterating, { db: parseDb(uri.path) });
};
const addHostname = (uri, iterating) => {
    const authority = uri.authority;
    return Object.assign({}, iterating, { host: authority.host });
};
const addPassword = (uri, iterating) => {
    const authority = uri.authority;
    if (utility_1.isNullOrUndefined(authority.userInfo)
        || utility_1.isNullOrUndefined(authority.userInfo.pass)) {
        return iterating;
    }
    return Object.assign({}, iterating, { password: authority.userInfo.pass });
};
const addPort = (uri, iterating) => {
    const authority = uri.authority;
    if (utility_1.isNullOrUndefined(authority.port)) {
        return iterating;
    }
    return Object.assign({}, iterating, { port: authority.port });
};
const parseDb = (maybeDb) => {
    const DB_INDEX = 1;
    const maybeMatches = /^\/0*(\d+)/.exec(maybeDb);
    if (utility_1.isNullOrUndefined(maybeMatches)) {
        throw new errors_1.ParseError(`unable to parse "${maybeDb}" as db path`);
    }
    const matches = maybeMatches;
    return utility_1.parseInteger(matches[DB_INDEX]);
};
//# sourceMappingURL=tcp.js.map