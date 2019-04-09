import { MessageBroker } from "./message_broker";
export interface Configuration {
    taskCompression?: "gzip" | "zlib";
    taskProtocol?: 2;
    taskSerializer?: "json" | "yaml";
    taskIgnoreResult?: boolean;
    taskTimeLimit?: number;
    taskSoftTimeLimit?: number;
    resultBackend?: string;
    resultBackendTransportOptions?: {
        [key: string]: any | undefined;
    };
    resultSerializer?: "json" | "yaml";
    resultCompression?: "gzip" | "zlib";
    resultExpires?: number;
    resultPersistent?: boolean;
    redisBackendUseSsl?: SslOptions;
    taskDefaultQueue?: string;
    taskDefaultDeliveryMode?: "persistent" | "transient";
    brokerUrl?: string | Array<string>;
    brokerFailoverStrategy?: "round-robin" | "shuffle" | FailoverStrategy;
    brokerUseSsl?: SslOptions;
    brokerTransportOptions?: {
        [key: string]: any | undefined;
    };
}
export declare const DEFAULT_CONFIG: Configuration;
export declare type ContentType = "json" | "yaml" | "application/json" | "application/x-yaml";
export declare type FailoverStrategy = (brokers: Array<MessageBroker>) => MessageBroker;
export interface SslOptions {
    keyfile?: string;
    certfile?: string;
    caCerts?: string;
    certReqs: CertificationRequirement;
}
export declare enum CertificationRequirement {
    None = 0,
    Optional = 1,
    Required = 2
}
