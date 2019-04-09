"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Packer {
    constructor({ serializer, compressor, encoder }) {
        this.compressor = compressor;
        this.encoder = encoder;
        this.serializer = serializer;
    }
    pack(data) {
        const serialized = this.serializer.serialize(data);
        const compressed = this.compressor.compress(serialized);
        const encoded = this.encoder.encode(compressed);
        return encoded;
    }
    unpack(packed) {
        const decoded = this.encoder.decode(packed);
        const decompressed = this.compressor.decompress(decoded);
        const deserialized = this.serializer.deserialize(decompressed);
        return deserialized;
    }
}
exports.Packer = Packer;
//# sourceMappingURL=packer.js.map