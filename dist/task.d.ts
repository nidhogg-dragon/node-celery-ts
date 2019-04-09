import { FailoverStrategy } from "./config";
import { MessageBroker } from "./message_broker";
import * as Packer from "./packer";
import { Result } from "./result";
import { ResultBackend } from "./result_backend";
export declare class Task<T> {
    private readonly appId;
    private readonly backend;
    private broker;
    private readonly brokers;
    private readonly deliveryMode;
    private readonly failoverStrategy;
    private readonly name;
    private readonly queue;
    private readonly timeLimit;
    constructor({ appId, backend, brokers, deliveryMode, failoverStrategy, hardTimeLimit, name, queue, softTimeLimit, }: TaskOptions);
    applyAsync({ args, compression, eta, expires, ignoreResult, kwargs, priority, queue, id, serializer, }: TaskApplyOptions): Result<T> | {
        [key: string]: any;
    };
    private static dateOrNull;
    private static getTimeLimit;
    private getDeliveryMode;
    private static createPacker;
    private static packBody;
    private static getContentTypeMime;
    private static getOrigin;
    private createHeaders;
    private createProperties;
    private static selectEncoder;
    private static getEncodingMime;
}
export interface TaskOptions {
    appId: string;
    backend: ResultBackend;
    brokers: Array<MessageBroker>;
    deliveryMode?: "persistent" | "transient";
    failoverStrategy: FailoverStrategy;
    hardTimeLimit?: number;
    name: string;
    queue?: string;
    softTimeLimit?: number;
}
export interface TaskApplyOptions {
    args: Args;
    compression?: Packer.Compressor;
    eta?: Date;
    expires?: Date;
    ignoreResult?: boolean;
    kwargs: KeywordArgs;
    priority?: Priority;
    queue?: string;
    id?: string;
    serializer?: Packer.Serializer;
}
export declare type Args = Array<any>;
export interface KeywordArgs {
    [key: string]: any | undefined;
}
export declare type Priority = number;
