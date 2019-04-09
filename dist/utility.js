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
const errors_1 = require("./errors");
exports.parseInteger = (maybeInt) => {
    const [radix, toParse] = (() => {
        const toReturn = getRadix(maybeInt);
        if (exports.isNullOrUndefined(toReturn)) {
            throw new errors_1.ParseError("Celery.Utility.parseInteger: could not "
                + `parse ${maybeInt} as integer`);
        }
        return toReturn;
    })();
    const maybeParsed = Number.parseInt(toParse, radix);
    return maybeParsed;
};
exports.parseBoolean = (maybeBoolean) => {
    switch (maybeBoolean.toLowerCase().trim()) {
        case "true":
        case "1":
        case "on":
        case "yes": return true;
        case "false":
        case "0":
        case "off":
        case "no": return false;
    }
    throw new errors_1.ParseError("Celery.Utility.parseBoolean: could not parse "
        + `${maybeBoolean} as a boolean`);
};
exports.isNullOrUndefined = (value) => exports.isNull(value) || exports.isUndefined(value);
exports.isNull = (value) => value === null;
exports.isUndefined = (value) => typeof value === "undefined";
exports.toCamelCase = (toConvert) => toConvert.replace(/_([a-z])/, (_, match) => match.toUpperCase());
exports.promisifyEvent = (emitter, name) => __awaiter(this, void 0, void 0, function* () { return new Promise((resolve) => emitter.once(name, resolve)); });
exports.filterMapEvent = ({ emitter, filterMap, name }) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve) => {
        let resolved = false;
        const onEvent = (...values) => {
            if (resolved) {
                return;
            }
            const maybeMapped = filterMap(...values);
            if (!exports.isNullOrUndefined(maybeMapped)) {
                emitter.removeListener(name, onEvent);
                resolve(maybeMapped);
                resolved = true;
            }
        };
        emitter.addListener(name, onEvent);
    });
});
exports.createTimeoutPromise = (promise, timeout) => __awaiter(this, void 0, void 0, function* () {
    if (exports.isNullOrUndefined(timeout)) {
        return promise;
    }
    return Promise.race([promise, exports.createTimerPromise(timeout)]);
});
exports.createTimerPromise = (timeout) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("timed out")), timeout));
});
const getRadix = (maybeNumber) => {
    const REGEX = /^(?:(0[0-7]*)|(?:0x([\da-f]+))|(?:0b([01]+))|([1-9][\d]*))$/;
    const OCTAL_INDEX = 1;
    const HEX_INDEX = 2;
    const BINARY_INDEX = 3;
    const DECIMAL_INDEX = 4;
    const trimmedLowered = maybeNumber.toLowerCase().trim();
    const maybeMatches = REGEX.exec(trimmedLowered);
    if (exports.isNullOrUndefined(maybeMatches)) {
        return undefined;
    }
    const matches = maybeMatches;
    if (!exports.isNullOrUndefined(matches[OCTAL_INDEX])) {
        return [8, matches[OCTAL_INDEX]];
    }
    else if (!exports.isNullOrUndefined(matches[HEX_INDEX])) {
        return [16, matches[HEX_INDEX]];
    }
    else if (!exports.isNullOrUndefined(matches[BINARY_INDEX])) {
        return [2, matches[BINARY_INDEX]];
    }
    return [10, matches[DECIMAL_INDEX]];
};
//# sourceMappingURL=utility.js.map