"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const utility_1 = require("../utility");
class PromiseMap {
    constructor(timeout) {
        this.promises = new Map();
        this.data = new Map();
        this.timeout = timeout;
    }
    has(key) {
        return this.promises.has(key);
    }
    isPending(key) {
        const entry = this.data.get(key);
        return !utility_1.isUndefined(entry) && entry.status === State.Pending;
    }
    isFulfilled(key) {
        const entry = this.data.get(key);
        return !utility_1.isUndefined(entry) && entry.status === State.Fulfilled;
    }
    isRejected(key) {
        const entry = this.data.get(key);
        return !utility_1.isUndefined(entry) && entry.status === State.Rejected;
    }
    resolve(key, value) {
        return this.settle({
            key,
            onExisting: (data) => this.resolveExisting({ key, data, value }),
            onNew: () => this.resolveNew(key, value),
        });
    }
    reject(key, reason) {
        return this.settle({
            key,
            onExisting: (data) => this.rejectExisting({ key, data, reason }),
            onNew: () => this.rejectNew(reason),
        });
    }
    rejectAll(reason) {
        let numRejected = 0;
        for (const [key, data] of this.data.entries()) {
            if (data.status !== State.Pending || utility_1.isUndefined(data.functions)) {
                continue;
            }
            this.reject(key, reason);
            ++numRejected;
        }
        return numRejected;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const maybePromise = this.promises.get(key);
            if (!utility_1.isUndefined(maybePromise)) {
                return maybePromise;
            }
            const promise = new Promise((resolve, reject) => this.data.set(key, {
                functions: { resolve, reject },
                status: State.Pending,
            }));
            this.promises.set(key, promise);
            return promise;
        });
    }
    delete(key) {
        return this.doDelete(key, new Error("deleted"));
    }
    clear() {
        const error = new Error("cleared");
        for (const controlBlock of this.data.values()) {
            if (utility_1.isUndefined(controlBlock.functions)) {
                continue;
            }
            controlBlock.functions.reject(error);
        }
        const numDeleted = this.promises.size;
        this.promises.clear();
        this.data.clear();
        return numDeleted;
    }
    settle({ key, onExisting, onNew }) {
        const maybeData = this.data.get(key);
        const hasKey = !utility_1.isUndefined(maybeData);
        if (hasKey) {
            const data = maybeData;
            const newData = onExisting(data);
            this.data.set(key, newData);
        }
        else {
            const [promise, data] = onNew();
            this.promises.set(key, promise);
            this.data.set(key, data);
        }
        this.setTimeout(key);
        return !hasKey;
    }
    resolveExisting({ key, data, value }) {
        if (!utility_1.isUndefined(data.functions)) {
            data.functions.resolve(this.doResolve(key, value));
        }
        else {
            this.promises.set(key, this.doResolve(key, value));
        }
        return Object.assign({}, removeFunctions(data), { status: State.Pending });
    }
    resolveNew(key, value) {
        return [this.doResolve(key, value), { status: State.Pending }];
    }
    rejectExisting({ key, data, reason }) {
        if (!utility_1.isUndefined(data.functions)) {
            data.functions.reject(reason);
        }
        else {
            this.promises.set(key, Promise.reject(reason));
        }
        return Object.assign({}, removeFunctions(data), { status: State.Rejected });
    }
    rejectNew(reason) {
        return [Promise.reject(reason), { status: State.Rejected }];
    }
    doResolve(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resolved = yield value;
                this.setStatus(key, State.Fulfilled);
                return resolved;
            }
            catch (error) {
                this.setStatus(key, State.Rejected);
                throw error;
            }
        });
    }
    setStatus(key, status) {
        const maybeExisting = this.data.get(key);
        const toSet = (() => {
            if (typeof maybeExisting === "undefined") {
                return { status };
            }
            return Object.assign({}, maybeExisting, { status });
        })();
        this.data.set(key, toSet);
    }
    setTimeout(key) {
        const maybeData = this.data.get(key);
        if (utility_1.isUndefined(maybeData) || utility_1.isUndefined(this.timeout)) {
            return false;
        }
        if (!utility_1.isUndefined(maybeData.timer)) {
            clearTimeout(maybeData.timer);
        }
        const doDelete = () => this.doDelete(key, new Error("timed out"));
        const withTimer = Object.assign({}, maybeData, { timer: setTimeout(doDelete, this.timeout) });
        this.data.set(key, withTimer);
        return true;
    }
    doDelete(key, reason) {
        const maybeData = this.data.get(key);
        if (!utility_1.isUndefined(maybeData)) {
            if (!utility_1.isUndefined(maybeData.functions)) {
                maybeData.functions.reject(reason);
            }
            if (!utility_1.isUndefined(maybeData.timer)) {
                clearTimeout(maybeData.timer);
            }
        }
        this.data.delete(key);
        return this.promises.delete(key);
    }
}
exports.PromiseMap = PromiseMap;
var State;
(function (State) {
    State[State["Pending"] = 0] = "Pending";
    State[State["Fulfilled"] = 1] = "Fulfilled";
    State[State["Rejected"] = 2] = "Rejected";
})(State || (State = {}));
const removeFunctions = (data) => {
    const { functions: _ } = data, toReturn = __rest(data, ["functions"]);
    return toReturn;
};
//# sourceMappingURL=promise_map.js.map