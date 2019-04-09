/// <reference types="node" />
export interface Encoder {
    encode(data: Buffer): string;
    decode(data: string): Buffer;
}
export declare const createPlaintextEncoder: () => Encoder;
export declare const createBase64Encoder: () => Encoder;
