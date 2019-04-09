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
const messages_1 = require("./messages");
const null_backend_1 = require("./null_backend");
const Packer = require("./packer");
const result_1 = require("./result");
const utility_1 = require("./utility");
const Os = require("os");
const Process = require("process");
const Uuid = require("uuid");
class Task {
    constructor({ appId, backend, brokers, deliveryMode = "persistent", failoverStrategy, hardTimeLimit, name, queue = "celery", softTimeLimit, }) {
        this.deliveryMode = "persistent";
        this.queue = "celery";
        this.timeLimit = [null, null];
        this.appId = appId;
        this.backend = backend;
        this.broker = failoverStrategy(brokers);
        this.brokers = brokers;
        this.deliveryMode = deliveryMode;
        this.failoverStrategy = failoverStrategy;
        this.name = name;
        this.queue = queue;
        this.timeLimit = Task.getTimeLimit({
            hard: hardTimeLimit,
            soft: softTimeLimit,
        });
    }
    applyAsync({ args, compression = Packer.Compressor.Identity, eta, expires, ignoreResult = false, kwargs, priority = 0, queue = this.queue, id, serializer = Packer.Serializer.Json, }) {
        const backend = (() => {
            if (ignoreResult) {
                return new null_backend_1.NullBackend();
            }
            return this.backend;
        })();
        if (!id || id === '') {
            id = Uuid.v4();
        }
        let result = null;
        if (!ignoreResult) {
            result = new result_1.Result(id, backend);
            console.log(result);
        }
        const [packer, encoding] = Task.createPacker(serializer, compression);
        const body = Task.packBody({ args, kwargs, packer });
        const etaStr = Task.dateOrNull(eta);
        const expiresStr = Task.dateOrNull(expires);
        const publishOptions = {
            body,
            "content-encoding": messages_1.ContentEncodingMime.Utf8,
            "content-type": Task.getContentTypeMime(serializer),
            headers: this.createHeaders({
                args,
                compression,
                eta: etaStr,
                expires: expiresStr,
                id,
                kwargs,
            }),
            properties: this.createProperties({
                deliveryMode: this.getDeliveryMode(),
                encoding,
                id,
                priority,
                queue,
            }),
        };
        const tryPublish = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.broker.publish(publishOptions);
            }
            catch (_a) {
                this.broker = this.failoverStrategy(this.brokers);
                return tryPublish();
            }
        });
        tryPublish();
        return {
            taskId: id
        };
    }
    static dateOrNull(date) {
        if (utility_1.isNullOrUndefined(date)) {
            return null;
        }
        return date.toISOString();
    }
    static getTimeLimit({ soft, hard }) {
        if (!utility_1.isNullOrUndefined(soft) && !utility_1.isNullOrUndefined(hard)) {
            return [soft, hard];
        }
        else if (!utility_1.isNullOrUndefined(soft)) {
            return [soft, null];
        }
        else if (!utility_1.isNullOrUndefined(hard)) {
            return [null, hard];
        }
        return [null, null];
    }
    getDeliveryMode() {
        if (this.deliveryMode === "transient") {
            return 1;
        }
        return 2;
    }
    static createPacker(serializer, compressor) {
        const encoder = Task.selectEncoder(compressor);
        const realCompressor = (() => {
            if (compressor === Packer.Compressor.Gzip) {
                return Packer.Compressor.Zlib;
            }
            return compressor;
        })();
        return [
            Packer.createPacker({
                compressor: realCompressor,
                encoder,
                serializer,
            }),
            encoder
        ];
    }
    static packBody({ args, kwargs, packer }) {
        return packer.pack([
            args,
            kwargs,
            { callbacks: null, chain: null, chord: null, errbacks: null },
        ]);
    }
    static getContentTypeMime(serializer) {
        switch (serializer) {
            case Packer.Serializer.Json: return messages_1.ContentTypeMime.Json;
            case Packer.Serializer.Yaml: return messages_1.ContentTypeMime.Yaml;
        }
    }
    static getOrigin() {
        return `${Process.pid}@${Os.hostname()}`;
    }
    createHeaders({ args, compression, eta, expires, kwargs, id }) {
        const base = {
            argsrepr: JSON.stringify(args),
            eta,
            expires,
            group: null,
            id,
            kwargsrepr: JSON.stringify(kwargs),
            lang: "py",
            origin: Task.getOrigin(),
            parent_id: null,
            retries: 0,
            root_id: id,
            shadow: null,
            task: this.name,
            timelimit: this.timeLimit,
        };
        if (compression === Packer.Compressor.Identity) {
            return base;
        }
        return Object.assign({}, base, { compression: messages_1.CompressionMime.Zlib });
    }
    createProperties({ deliveryMode, encoding, id, priority, queue, }) {
        return {
            body_encoding: Task.getEncodingMime(encoding),
            correlation_id: id,
            delivery_info: {
                exchange: "",
                routing_key: queue,
            },
            delivery_mode: deliveryMode,
            delivery_tag: "celery",
            priority,
            reply_to: this.appId,
        };
    }
    static selectEncoder(compressor) {
        if (compressor === Packer.Compressor.Identity) {
            return Packer.Encoder.Plaintext;
        }
        return Packer.Encoder.Base64;
    }
    static getEncodingMime(encoding) {
        switch (encoding) {
            case Packer.Encoder.Base64: return messages_1.ContentEncodingMime.Base64;
            case Packer.Encoder.Plaintext: return messages_1.ContentEncodingMime.Utf8;
        }
    }
}
exports.Task = Task;
//# sourceMappingURL=task.js.map