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
const list_1 = require("./list");
class PromiseQueue {
    constructor() {
        this.queue = new list_1.List();
    }
    push() {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = new Promise((resolve, reject) => {
                this.queue.push({ reject, resolve });
            });
            return promise;
        });
    }
    resolveAll(value) {
        return invokeWhile(() => this.resolveOne(value));
    }
    rejectAll(reason) {
        return invokeWhile(() => this.rejectOne(reason));
    }
    resolveOne(value) {
        return this.settleOne("resolve", value);
    }
    rejectOne(reason) {
        return this.settleOne("reject", reason);
    }
    settleOne(method, argument) {
        const maybeHead = this.queue.shift();
        if (typeof maybeHead === "undefined") {
            return false;
        }
        const toSettle = maybeHead;
        if (method === "reject") {
            toSettle.reject(argument);
        }
        else if (method === "resolve") {
            toSettle.resolve(argument);
        }
        return true;
    }
}
exports.PromiseQueue = PromiseQueue;
const invokeWhile = (condition) => {
    let numTrue = 0;
    while (condition()) {
        ++numTrue;
    }
    return numTrue;
};
//# sourceMappingURL=promise_queue.js.map