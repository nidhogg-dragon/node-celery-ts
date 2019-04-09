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
const utility_1 = require("./utility");
class Result {
    constructor(taskId, backend) {
        this.taskId = taskId;
        this.backend = backend;
        this.result = this.getResult();
    }
    get(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return utility_1.createTimeoutPromise(this.result, timeout);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.backend.delete(this.taskId);
        });
    }
    getResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.backend.get({ taskId: this.taskId });
            return message.result;
        });
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map