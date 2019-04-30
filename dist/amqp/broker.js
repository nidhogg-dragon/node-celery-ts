"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AmqpLib = require("amqplib");
const containers_1 = require("../containers");
const utility_1 = require("../utility");
const options_1 = require("./options");
class AmqpBroker {
    constructor(options) {
        this.reconnecting = false;
        this.options = (() => {
            if (utility_1.isNullOrUndefined(options)) {
                return options_1.DEFAULT_AMQP_OPTIONS;
            }
            return options;
        })();
        this.connection = Promise.resolve(AmqpLib.connect(this.options));
        this.connection.then((conn) => {
            conn.on("close", (error) => __awaiter(this, void 0, void 0, function* () {
                console.log("connection close", error);
            }));
            conn.on("error", (error) => __awaiter(this, void 0, void 0, function* () {
                console.log("connection error", error);
                if (!this.reconnecting) {
                    this.reconnect();
                }
            }));
        }).catch((error) => {
            console.log("connection init error", error);
        });
        this.channels = new containers_1.ResourcePool(() => __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.connection;
            return connection.createChannel();
        }), (channel) => __awaiter(this, void 0, void 0, function* () {
            yield channel.close();
            return "closed";
        }), 2);
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.end();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channels.destroyAll();
            const connection = yield this.connection;
            yield connection.close();
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reconnecting = true;
            yield new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 5000);
            });
            this.connection = Promise.resolve(AmqpLib.connect(this.options));
            this.connection.then((conn) => {
                conn.on("close", (error) => __awaiter(this, void 0, void 0, function* () {
                    console.log("connection close", error);
                }));
                conn.on("error", (error) => {
                    console.log("connection error", error);
                    if (!this.reconnecting) {
                        this.reconnect();
                    }
                });
            }).catch((error) => {
                console.log("connection init error", error);
                if (!this.reconnecting) {
                    this.reconnect();
                }
            });
            this.channels = new containers_1.ResourcePool(() => __awaiter(this, void 0, void 0, function* () {
                const connection = yield this.connection;
                return connection.createChannel();
            }), (channel) => __awaiter(this, void 0, void 0, function* () {
                yield channel.close();
                return "closed";
            }), 2);
            this.reconnecting = false;
        });
    }
    publish(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const exchange = message.properties.delivery_info.exchange;
            const routingKey = message.properties.delivery_info.routing_key;
            const body = AmqpBroker.getBody(message);
            const options = AmqpBroker.getPublishOptions(message);
            return this.channels.use((channel) => __awaiter(this, void 0, void 0, function* () {
                yield AmqpBroker.assert({ channel, exchange, routingKey });
                return AmqpBroker.doPublish({
                    body,
                    channel,
                    exchange,
                    options,
                    routingKey
                });
            }));
        });
    }
    static getBody(message) {
        return Buffer.from(message.body, message.properties.body_encoding);
    }
    static getPublishOptions(message) {
        return {
            contentEncoding: message["content-encoding"],
            contentType: message["content-type"],
            correlationId: message.properties.correlation_id,
            deliveryMode: message.properties.delivery_mode,
            headers: message.headers,
            priority: message.properties.priority,
            replyTo: message.properties.reply_to,
        };
    }
    static assert({ channel, exchange, routingKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            const assertion = channel.assertQueue(routingKey, { maxPriority: 10 });
            if (exchange === "") {
                yield assertion;
            }
            else {
                yield Promise.all([
                    assertion,
                    channel.assertExchange(exchange, "direct"),
                ]);
            }
        });
    }
    static doPublish({ body, channel, exchange, options, routingKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            const publish = () => channel.publish(exchange, routingKey, body, options);
            while (!publish()) {
                yield utility_1.promisifyEvent(channel, "drain");
            }
            return "flushed to write buffer";
        });
    }
}
exports.AmqpBroker = AmqpBroker;
//# sourceMappingURL=broker.js.map