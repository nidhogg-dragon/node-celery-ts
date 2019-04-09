import * as Compressor from "./compressor";
import * as Encoder from "./encoder";
import * as Serializer from "./serializer";
export declare class Packer {
    private compressor;
    private encoder;
    private serializer;
    constructor({ serializer, compressor, encoder }: Options);
    pack(data: any): string;
    unpack(packed: string): any;
}
export interface Options {
    compressor: Compressor.Compressor;
    encoder: Encoder.Encoder;
    serializer: Serializer.Serializer;
}
