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
const utility_1 = require("../utility");
class RedisBroker {
    constructor(options) {
        this.options = (() => {
            if (utility_1.isNullOrUndefined(options)) {
                return options_1.DEFAULT_REDIS_OPTIONS;
            }
            return options;
        })();
        this.connection = this.options.createClient({ keyPrefix: "" });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection.disconnect();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.quit();
            this.connection.disconnect();
        });
    }
    publish(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const toPublish = JSON.stringify(message);
            const queue = "celery";
            return this.connection.lpush(queue, toPublish);
        });
    }
}
exports.RedisBroker = RedisBroker;
//# sourceMappingURL=broker.js.map