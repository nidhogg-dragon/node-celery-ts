/// <reference types="node" />
export interface Serializer {
    serialize(data: any): Buffer;
    deserialize(data: Buffer): any;
}
export declare const createJsonSerializer: () => Serializer;
export declare const createYamlSerializer: () => Serializer;
