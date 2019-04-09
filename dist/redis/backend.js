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
const options_1 = require("./options");
const containers_1 = require("../containers");
const messages_1 = require("../messages");
const utility_1 = require("../utility");
class RedisBackend {
    constructor(options) {
        this.results = new containers_1.PromiseMap(RedisBackend.TIMEOUT);
        this.options = (() => {
            if (utility_1.isNullOrUndefined(options)) {
                return options_1.DEFAULT_REDIS_OPTIONS;
            }
            return options;
        })();
        this.pool = new containers_1.ResourcePool(() => this.options.createClient({ keyPrefix: "celery-task-meta-" }), (connection) => __awaiter(this, void 0, void 0, function* () {
            const response = yield connection.quit();
            connection.disconnect();
            return response;
        }), 2);
        this.subscriber = this.pool.get()
            .then((subscriber) => __awaiter(this, void 0, void 0, function* () {
            yield subscriber.psubscribe("celery-task-meta-*");
            subscriber.on("pmessage", (_, channel, message) => this.onMessage(channel, message));
            return subscriber;
        }));
    }
    put(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = message.task_id;
            const toPut = JSON.stringify(message);
            return this.pool.use((client) => __awaiter(this, void 0, void 0, function* () {
                return client.multi()
                    .setex(key, RedisBackend.TIMEOUT / 1000, toPut)
                    .publish(key, toPut)
                    .exec();
            }));
        });
    }
    get({ taskId, timeout }) {
        return __awaiter(this, void 0, void 0, function* () {
            const listen = () => __awaiter(this, void 0, void 0, function* () {
                const raw = yield this.results.get(taskId);
                return JSON.parse(raw);
            });
            if (this.results.has(taskId)) {
                return listen();
            }
            return this.pool.use((client) => __awaiter(this, void 0, void 0, function* () {
                const response = (() => __awaiter(this, void 0, void 0, function* () {
                    const raw = yield client.get(taskId);
                    if (utility_1.isNullOrUndefined(raw)) {
                        return listen();
                    }
                    const parsed = JSON.parse(raw);
                    if (parsed.status !== messages_1.Status.Success) {
                        return listen();
                    }
                    return parsed;
                }))();
                return utility_1.createTimeoutPromise(response, timeout);
            }));
        });
    }
    delete(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pool.use((client) => __awaiter(this, void 0, void 0, function* () {
                this.results.delete(taskId);
                return client.del(taskId);
            }));
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.end();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriber = yield this.subscriber;
            yield subscriber.punsubscribe("celery-task-meta-*");
            this.pool.return(subscriber);
            yield this.pool.destroyAll();
        });
    }
    uri() {
        return this.options.createUri();
    }
    onMessage(channel, message) {
        const maybeId = channel.match(RedisBackend.UUID_REGEX);
        if (utility_1.isNullOrUndefined(maybeId)) {
            throw new Error(`channel ${channel} is not a celery result`);
        }
        const id = maybeId[RedisBackend.UUID_INDEX];
        this.results.resolve(id, message);
    }
}
RedisBackend.TIMEOUT = 86400000;
RedisBackend.UUID_REGEX = /^celery-task-meta-([A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12})$/;
RedisBackend.UUID_INDEX = 1;
exports.RedisBackend = RedisBackend;
//# sourceMappingURL=backend.js.map