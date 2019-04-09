"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Amqp = require("./amqp");
const client_1 = require("./client");
const errors_1 = require("./errors");
const null_backend_1 = require("./null_backend");
const Redis = require("./redis");
const uri_1 = require("./uri");
const utility_1 = require("./utility");
const Uuid = require("uuid");
exports.createClient = ({ brokerUrl, resultBackend }) => {
    const id = Uuid.v4();
    const backend = (() => {
        if (utility_1.isNullOrUndefined(resultBackend)) {
            return new null_backend_1.NullBackend();
        }
        return exports.createBackend(id, resultBackend);
    })();
    const brokers = (() => {
        if (typeof brokerUrl === "string") {
            return [exports.createBroker(brokerUrl)];
        }
        return brokerUrl.map(exports.createBroker);
    })();
    return new client_1.Client({
        backend,
        brokers,
        id,
    });
};
exports.createBackend = (id, rawUri) => {
    try {
        const scheme = uri_1.getScheme(rawUri);
        switch (scheme) {
            case uri_1.Scheme.Redis:
                return new Redis.RedisBackend(new Redis.RedisTcpOptions(Redis.parseTcpUri(rawUri)));
            case uri_1.Scheme.RedisSocket:
                return new Redis.RedisBackend(new Redis.RedisSocketOptions(Redis.parseSocketUri(rawUri)));
            case uri_1.Scheme.RedisSentinel:
                return new Redis.RedisBackend(new Redis.RedisSentinelOptions(Redis.parseSentinelUri(rawUri)));
            case uri_1.Scheme.Rpc:
                return new Amqp.RpcBackend(id, Amqp.parseAmqpUri(rawUri));
        }
    }
    catch (error) {
        throw new Error("Celery.Factories.createBackend: could not parse URI "
            + `${rawUri}: ${error}`);
    }
    throw new errors_1.UnimplementedError("Celery.Factory.createBackend");
};
exports.createBroker = (rawUri) => {
    try {
        const scheme = uri_1.getScheme(rawUri);
        switch (scheme) {
            case uri_1.Scheme.Redis:
                return new Redis.RedisBroker(new Redis.RedisTcpOptions(Redis.parseTcpUri(rawUri)));
            case uri_1.Scheme.RedisSocket:
                return new Redis.RedisBroker(new Redis.RedisSocketOptions(Redis.parseSocketUri(rawUri)));
            case uri_1.Scheme.RedisSentinel:
                return new Redis.RedisBroker(new Redis.RedisSentinelOptions(Redis.parseSentinelUri(rawUri)));
            case uri_1.Scheme.Amqp:
                return new Amqp.AmqpBroker(Amqp.parseAmqpUri(rawUri));
        }
    }
    catch (error) {
        throw new Error("Celery.Factories.createBroker: could not parse URI "
            + `${rawUri}: ${error}`);
    }
    throw new errors_1.UnimplementedError("Celery.Factory.createBroker");
};
//# sourceMappingURL=factories.js.map