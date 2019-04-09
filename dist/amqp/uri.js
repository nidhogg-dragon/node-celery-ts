"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const query_parser_1 = require("../query_parser");
const uri_1 = require("../uri");
const utility_1 = require("../utility");
exports.parseAmqpUri = (rawUri) => {
    const scheme = uri_1.getScheme(rawUri);
    if (scheme !== uri_1.Scheme.Amqp && scheme !== uri_1.Scheme.AmqpSecure
        && scheme !== uri_1.Scheme.Rpc && scheme !== uri_1.Scheme.RpcSecure) {
        throw new errors_1.ParseError(`unrecognized scheme "${scheme}"`);
    }
    const uri = uri_1.parseUri(rawUri);
    if (utility_1.isNullOrUndefined(uri.authority)) {
        throw new errors_1.ParseError(`"${rawUri}" missing authority`);
    }
    const protocol = (() => {
        switch (scheme) {
            case uri_1.Scheme.Rpc: return uri_1.Scheme.Amqp;
            case uri_1.Scheme.RpcSecure: return uri_1.Scheme.AmqpSecure;
        }
        return scheme;
    })();
    const withOptions = appendOptions(uri, {
        hostname: uri.authority.host,
        protocol,
    });
    const withVhost = appendVhost(rawUri, withOptions);
    const withQueries = appendQueries(uri, withVhost);
    return withQueries;
};
const appendOptions = (uri, appending) => {
    const functions = [appendPass(uri), appendPort(uri), appendUser(uri)];
    return functions.reduce((x, f) => f(x), appending);
};
const appendQueries = (uri, appending) => {
    if (utility_1.isNullOrUndefined(uri.query)) {
        return appending;
    }
    const query = uri.query;
    const parser = new query_parser_1.QueryParser([
        query_parser_1.createIntegerQueryDescriptor("channelMax"),
        query_parser_1.createIntegerQueryDescriptor("frameMax"),
        query_parser_1.createIntegerQueryDescriptor("heartbeat"),
        { source: "locale" },
    ]);
    return parser.parse(query, appending);
};
const appendVhost = (rawUri, appending) => {
    const maybeMatches = /^.+:\/\/[^/]*\/([\w\d-.~%]*)$/.exec(rawUri);
    if (utility_1.isNullOrUndefined(maybeMatches)) {
        return appending;
    }
    const vhost = decodeURIComponent(maybeMatches[1]);
    return Object.assign({}, appending, { vhost });
};
const appendPass = (uri) => (options) => {
    if (utility_1.isNullOrUndefined(uri.authority)
        || utility_1.isNullOrUndefined(uri.authority.userInfo)
        || utility_1.isNullOrUndefined(uri.authority.userInfo.pass)) {
        return options;
    }
    return Object.assign({}, options, { password: uri.authority.userInfo.pass });
};
const appendPort = (uri) => (options) => {
    if (utility_1.isNullOrUndefined(uri.authority)
        || utility_1.isNullOrUndefined(uri.authority.port)) {
        return options;
    }
    return Object.assign({}, options, { port: uri.authority.port });
};
const appendUser = (uri) => (options) => {
    if (utility_1.isNullOrUndefined(uri.authority)
        || utility_1.isNullOrUndefined(uri.authority.userInfo)) {
        return options;
    }
    return Object.assign({}, options, { username: uri.authority.userInfo.user });
};
//# sourceMappingURL=uri.js.map