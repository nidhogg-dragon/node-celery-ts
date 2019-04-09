"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Zlib = require("zlib");
exports.createIdentityCompressor = () => ({
    compress: (buffer) => Buffer.from(buffer),
    decompress: (buffer) => Buffer.from(buffer),
});
exports.createGzipCompressor = () => ({
    compress: (buffer) => Zlib.gzipSync(buffer),
    decompress: (buffer) => Zlib.unzipSync(buffer),
});
exports.createZlibCompressor = () => ({
    compress: (buffer) => Zlib.deflateSync(buffer),
    decompress: (buffer) => Zlib.unzipSync(buffer),
});
//# sourceMappingURL=compressor.js.map