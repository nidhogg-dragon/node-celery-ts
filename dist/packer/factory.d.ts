import * as Packer from "./packer";
export declare const createPacker: ({ serializer, compressor, encoder }: Options) => Packer.Packer;
export declare const createDefaultPacker: () => Packer.Packer;
export interface Options {
    compressor: CompressorType;
    encoder: EncoderType;
    serializer: SerializerType;
}
export declare enum CompressorType {
    Gzip = "gzip",
    Identity = "identity",
    Zlib = "zlib"
}
export declare enum EncoderType {
    Base64 = "base64",
    Plaintext = "plaintext"
}
export declare enum SerializerType {
    Json = "json",
    Yaml = "yaml"
}
