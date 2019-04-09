"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaintextEncoder = () => ({
    encode: (data) => data.toString("utf8"),
    decode: (data) => Buffer.from(data, "utf8"),
});
exports.createBase64Encoder = () => ({
    encode: (data) => data.toString("base64"),
    decode: (data) => Buffer.from(data, "base64"),
});
//# sourceMappingURL=encoder.js.map