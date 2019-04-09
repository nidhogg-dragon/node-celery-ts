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
class NullBackend {
    constructor() { }
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("cannot put results onto a null backend");
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("cannot get results from a null backend");
        });
    }
    delete() {
        throw new Error("cannot delete results from a null backend");
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.end();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    uri() {
        throw new Error("cannot query the URI of a null backend");
    }
}
exports.NullBackend = NullBackend;
//# sourceMappingURL=null_backend.js.map