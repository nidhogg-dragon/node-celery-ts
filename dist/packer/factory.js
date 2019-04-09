"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Compressor = require("./compressor");
const Encoder = require("./encoder");
const Packer = require("./packer");
const Serializer = require("./serializer");
exports.createPacker = ({ serializer, compressor, encoder }) => {
    const compressorObj = createCompressor(compressor);
    const encoderObj = createEncoder(encoder);
    const serializerObj = createSerializer(serializer);
    return new Packer.Packer({
        compressor: compressorObj,
        encoder: encoderObj,
        serializer: serializerObj,
    });
};
exports.createDefaultPacker = () => exports.createPacker({
    compressor: CompressorType.Identity,
    encoder: EncoderType.Base64,
    serializer: SerializerType.Json,
});
var CompressorType;
(function (CompressorType) {
    CompressorType["Gzip"] = "gzip";
    CompressorType["Identity"] = "identity";
    CompressorType["Zlib"] = "zlib";
})(CompressorType = exports.CompressorType || (exports.CompressorType = {}));
var EncoderType;
(function (EncoderType) {
    EncoderType["Base64"] = "base64";
    EncoderType["Plaintext"] = "plaintext";
})(EncoderType = exports.EncoderType || (exports.EncoderType = {}));
var SerializerType;
(function (SerializerType) {
    SerializerType["Json"] = "json";
    SerializerType["Yaml"] = "yaml";
})(SerializerType = exports.SerializerType || (exports.SerializerType = {}));
const createCompressor = (type) => {
    switch (type) {
        case CompressorType.Gzip:
            return Compressor.createGzipCompressor();
        case CompressorType.Identity:
            return Compressor.createIdentityCompressor();
        case CompressorType.Zlib:
            return Compressor.createZlibCompressor();
    }
};
const createEncoder = (type) => {
    switch (type) {
        case EncoderType.Base64:
            return Encoder.createBase64Encoder();
        case EncoderType.Plaintext:
            return Encoder.createPlaintextEncoder();
    }
};
const createSerializer = (type) => {
    switch (type) {
        case SerializerType.Json:
            return Serializer.createJsonSerializer();
        case SerializerType.Yaml:
            return Serializer.createYamlSerializer();
    }
};
//# sourceMappingURL=factory.js.map