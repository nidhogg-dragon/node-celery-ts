"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const utility_1 = require("./utility");
const _ = require("underscore");
const UriJs = require("urijs");
var Scheme;
(function (Scheme) {
    Scheme["Amqp"] = "amqp";
    Scheme["AmqpSecure"] = "amqps";
    Scheme["Redis"] = "redis";
    Scheme["RedisSecure"] = "rediss";
    Scheme["RedisSentinel"] = "sentinel";
    Scheme["RedisSentinelSecure"] = "sentinels";
    Scheme["RedisSocket"] = "redis+socket";
    Scheme["RedisSocketSecure"] = "rediss+socket";
    Scheme["Rpc"] = "rpc";
    Scheme["RpcSecure"] = "rpcs";
})(Scheme = exports.Scheme || (exports.Scheme = {}));
const SCHEMES = new Set(_.values(Scheme));
exports.parseUri = (toParse) => {
    const parsed = (() => {
        try {
            return UriJs.parse(toParse);
        }
        catch (error) {
            throw new errors_1.ParseError("Celery.Uri.parse: unable to parse "
                + `${toParse}: ${error}`);
        }
    })();
    if (utility_1.isNullOrUndefined(parsed.path) || utility_1.isNullOrUndefined(parsed.protocol)) {
        throw new errors_1.ParseError(`Celery.Uri.parse: unable to parse ${parsed}: `
            + "missing path or protocol");
    }
    const withRequired = {
        path: parsed.path,
        raw: toParse,
        scheme: parsed.protocol.toLowerCase(),
    };
    const withAuthority = addHostUserPassAndPort(parsed, withRequired);
    const withQuery = addQuery(parsed, withAuthority);
    return withQuery;
};
exports.getScheme = (rawUri) => {
    const SCHEME_REGEX = /^([A-Za-z][A-Za-z\d+.-]*):/;
    const SCHEME_INDEX = 1;
    const maybeMatches = rawUri.match(SCHEME_REGEX);
    if (utility_1.isNullOrUndefined(maybeMatches)) {
        throw new errors_1.ParseError(`invalid uri "${rawUri}"`);
    }
    const matches = maybeMatches;
    const scheme = matches[SCHEME_INDEX].toLowerCase();
    if (!SCHEMES.has(scheme)) {
        throw new errors_1.ParseError(`unrecognized scheme "${scheme}"`);
    }
    return scheme;
};
const addHost = (uri, parsing) => {
    if (utility_1.isNullOrUndefined(uri.hostname)) {
        return parsing;
    }
    return Object.assign({}, parsing, { authority: {
            host: validateHost(uri.hostname).toLowerCase(),
        } });
};
const addHostAndUser = (uri, parsing) => {
    const withHost = addHost(uri, parsing);
    if (utility_1.isNullOrUndefined(withHost.authority)
        || utility_1.isNullOrUndefined(uri.username)) {
        return withHost;
    }
    return Object.assign({}, withHost, { authority: Object.assign({}, withHost.authority, { userInfo: {
                user: uri.username,
            } }) });
};
const addHostUserAndPass = (uri, parsing) => {
    const withUser = addHostAndUser(uri, parsing);
    if (utility_1.isNullOrUndefined(withUser.authority)) {
        return withUser;
    }
    if (utility_1.isNullOrUndefined(withUser.authority.userInfo)
        && !utility_1.isNullOrUndefined(uri.password)) {
        return Object.assign({}, withUser, { authority: Object.assign({}, withUser.authority, { userInfo: {
                    pass: uri.password,
                    user: "",
                } }) });
    }
    if (utility_1.isNullOrUndefined(withUser.authority.userInfo)
        || utility_1.isNullOrUndefined(uri.password)) {
        return withUser;
    }
    return Object.assign({}, withUser, { authority: Object.assign({}, withUser.authority, { userInfo: Object.assign({}, withUser.authority.userInfo, { pass: uri.password }) }) });
};
const addHostUserPassAndPort = (uri, parsing) => {
    const withPass = addHostUserAndPass(uri, parsing);
    if (utility_1.isNullOrUndefined(withPass.authority)
        || utility_1.isNullOrUndefined(uri.port)) {
        return withPass;
    }
    return Object.assign({}, withPass, { authority: Object.assign({}, withPass.authority, { port: parsePort(uri.port) }) });
};
const addQuery = (uri, parsing) => {
    const REGEX = /^[A-Za-z\d*-._+%]+=[A-Za-z\d*-._+%]*(?:&[A-Za-z\d*-._+%]+=[A-Za-z\d*-._+%+]*)*$/;
    if (utility_1.isNullOrUndefined(uri.query)) {
        return parsing;
    }
    if (!REGEX.test(uri.query)) {
        throw new errors_1.ParseError(`query "${uri.query}" is not a valid HTML query`);
    }
    const unconverted = UriJs.parseQuery(uri.query);
    const camelCaseQuery = (queries, key) => {
        const cased = utility_1.toCamelCase(key);
        if (cased === key) {
            return queries;
        }
        const _a = Object.assign({}, queries, { [cased]: queries[key] }), _b = key, _key = _a[_b], renamed = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        return renamed;
    };
    const query = Object.keys(unconverted)
        .reduce(camelCaseQuery, unconverted);
    return Object.assign({}, parsing, { query });
};
const parsePort = (maybePort) => {
    const maybeMatches = /^\d+$/.exec(maybePort);
    if (utility_1.isNullOrUndefined(maybeMatches)) {
        throw new errors_1.ParseError(`could not parse "${maybePort}" as port`);
    }
    const parsed = Number.parseInt(maybePort, 10);
    return parsed;
};
const validateHost = (maybeHost) => {
    if (HOST_REGEX.test(maybeHost) === false) {
        throw new errors_1.ParseError(`invalid host "${maybeHost}"`);
    }
    return maybeHost;
};
const HOST_REGEX = /^(?:[A-Za-z\d]|[A-Za-z\d][A-Za-z\d-]{0,61}?[A-Za-z\d])(?:\.(?:[A-Za-z\d]|[A-Za-z\d][A-Za-z\d-]{0,61}?[A-Za-z\d]))*$/;
//# sourceMappingURL=uri.js.map