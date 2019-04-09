"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const IoRedis = require("ioredis");
const appendDefaultOptions = (options) => {
    const appended = Object.assign({}, options, { dropBufferSupport: true, keyPrefix: "celery-task-meta-", stringNumbers: true });
    return appended;
};
const maybeOverride = (options, override) => {
    if (typeof override === "undefined") {
        return options;
    }
    return Object.assign({}, options, override);
};
class RedisTcpOptions {
    constructor(options) {
        this.options = appendDefaultOptions(options);
    }
    createClient(override) {
        return new IoRedis(maybeOverride(this.options, override));
    }
    createUri() {
        let uri = "redis";
        if (typeof this.options.tls !== "undefined") {
            uri += "s";
        }
        uri += "://";
        if (typeof this.options.password !== "undefined") {
            uri += `:${this.options.password}@`;
        }
        if (typeof this.options.host !== "undefined"
            || typeof this.options.password !== "undefined") {
            if (typeof this.options.host === "undefined") {
                uri += "localhost";
            }
            else {
                uri += this.options.host;
            }
            if (typeof this.options.port !== "undefined") {
                uri += `:${this.options.port}`;
            }
        }
        if (typeof this.options.db !== "undefined") {
            uri += `/${this.options.db}`;
        }
        return uri;
    }
}
exports.RedisTcpOptions = RedisTcpOptions;
class RedisSocketOptions {
    constructor(options) {
        this.options = appendDefaultOptions(options);
    }
    createClient(override) {
        return new IoRedis(maybeOverride(this.options, override));
    }
    createUri() {
        let uri = "redis";
        if (typeof this.options.tls !== "undefined") {
            uri += "s";
        }
        uri += `+socket://${this.options.path}`;
        if (typeof this.options.password !== "undefined") {
            uri += `?password=${this.options.password}`;
        }
        return uri;
    }
}
exports.RedisSocketOptions = RedisSocketOptions;
class RedisSentinelOptions {
    constructor(options) {
        this.options = appendDefaultOptions(options);
    }
    createClient(override) {
        return new IoRedis(maybeOverride(this.options, override));
    }
    createUri() {
        throw new errors_1.UnimplementedError();
    }
}
exports.RedisSentinelOptions = RedisSentinelOptions;
class RedisClusterOptions {
    constructor(options) {
        this.options = (() => {
            if (typeof options.redisOptions === "undefined") {
                return options;
            }
            return Object.assign({}, options, { redisOptions: appendDefaultOptions(options.redisOptions) });
        })();
    }
    createClient() {
        return new IoRedis.Cluster(this.options.nodes, this.options);
    }
    createUri() {
        throw new errors_1.UnimplementedError();
    }
}
exports.RedisClusterOptions = RedisClusterOptions;
exports.DEFAULT_REDIS_OPTIONS = new RedisTcpOptions({
    protocol: "redis"
});
exports.createOptions = (options) => {
    if (isCluster(options)) {
        return new RedisClusterOptions(options);
    }
    else if (options.sentinels) {
        return new RedisSentinelOptions(options);
    }
    else if (options.path) {
        return new RedisSocketOptions(options);
    }
    return new RedisTcpOptions(Object.assign({}, options, { protocol: (() => {
            if (options.tls) {
                return "rediss";
            }
            return "redis";
        })() }));
};
const isCluster = (options) => options.nodes !== undefined;
//# sourceMappingURL=options.js.map