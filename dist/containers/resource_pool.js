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
const promise_queue_1 = require("./promise_queue");
const utility_1 = require("../utility");
const Events = require("events");
class ResourcePool {
    constructor(create, destroy, maxResources) {
        this.resourceCount = 0;
        this.create = create;
        this.destroy = destroy;
        this.maxResources = maxResources;
        this.emptyEmitter = new Events.EventEmitter();
        this.inUse = new Set();
        this.unused = new list_1.List();
        this.waiting = new promise_queue_1.PromiseQueue();
    }
    numOwned() {
        return this.resourceCount;
    }
    numInUse() {
        return this.resourceCount - this.unused.length;
    }
    numUnused() {
        return this.unused.length;
    }
    use(f) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.get();
            try {
                const result = f(resource);
                return this.returnAfter(result, resource);
            }
            catch (error) {
                return this.returnAfter(Promise.reject(error), resource);
            }
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getResource();
            this.inUse.add(resource);
            return resource;
        });
    }
    returnAfter(promise, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(promise)
                .then((value) => {
                this.return(resource);
                return value;
            }).catch((reason) => {
                this.return(resource);
                return Promise.reject(reason);
            });
        });
    }
    return(resource) {
        if (!this.inUse.delete(resource)) {
            throw new Error("resource does not belong to this pool");
        }
        if (this.waiting.resolveOne(resource)) {
            return;
        }
        if (this.inUse.size === 0) {
            this.emptyEmitter.emit("empty");
        }
        this.unused.push(resource);
    }
    destroyAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inUse.size !== 0) {
                yield utility_1.promisifyEvent(this.emptyEmitter, "empty");
            }
            const connections = Array.from(this.unused);
            this.unused = new list_1.List();
            const replies = connections.map((resource) => this.destroy(resource));
            return Promise.all(replies);
        });
    }
    getResource() {
        return __awaiter(this, void 0, void 0, function* () {
            const maybeUnused = this.unused.shift();
            if (typeof maybeUnused !== "undefined") {
                return maybeUnused;
            }
            else if (this.resourceCount < this.maxResources) {
                ++this.resourceCount;
                return Promise.resolve(this.create());
            }
            return this.waiting.push();
        });
    }
}
exports.ResourcePool = ResourcePool;
//# sourceMappingURL=resource_pool.js.map