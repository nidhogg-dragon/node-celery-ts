/// <reference types="node" />
export interface Compressor {
    compress(buffer: Buffer): Buffer;
    decompress(buffer: Buffer): Buffer;
}
export declare const createIdentityCompressor: () => Compressor;
export declare const createGzipCompressor: () => Compressor;
export declare const createZlibCompressor: () => Compressor;
