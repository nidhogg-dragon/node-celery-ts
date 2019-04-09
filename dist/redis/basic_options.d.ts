/// <reference types="node" />
import * as Tls from "tls";
export interface BasicRedisOptions {
    autoResendUnfulfilledCommands?: boolean;
    autoResubscribe?: boolean;
    connectionName?: string;
    connectTimeout?: number;
    db?: number;
    dropBufferSupport?: boolean;
    enableOfflineQueue?: boolean;
    enableReadyCheck?: boolean;
    keepAlive?: number;
    keyPrefix?: string;
    lazyConnect?: boolean;
    noDelay?: boolean;
    password?: string;
    protocol: string;
    readOnly?: boolean;
    reconnectOnError?(error: Error): boolean | 1 | 2;
    retryStrategy?(times: number): number | false;
    stringNumbers?: boolean;
    tls?: Tls.TlsOptions;
}
export interface BasicRedisTcpOptions extends BasicRedisOptions {
    family?: 4 | 6;
    host?: string;
    port?: number;
}
export interface BasicRedisSocketOptions extends BasicRedisOptions {
    path: string;
}
export interface BasicRedisSentinelOptions extends BasicRedisTcpOptions {
    name: string;
    role?: "master" | "slave";
    sentinelRetryStrategy?(times: number): number | false;
    sentinels: Array<RedisSentinelAuthority>;
}
export interface BasicRedisClusterOptions {
    clusterRetryStrategy?(times: number): number;
    enableOfflineQueue?: boolean;
    enableReadyCheck?: boolean;
    maxRedirections?: number;
    nodes: Array<RedisClusterNode>;
    redisOptions?: BasicRedisTcpOptions;
    retryDelayOnClusterDown?: number;
    retryDelayOnFailover?: number;
    scaleReads?: "master" | "slave" | "all";
}
export interface RedisTransportOptions {
    fanoutPatterns?: string;
    fanoutPrefix?: string;
    masterName?: string;
    visibilityTimeout?: number;
}
export interface RedisSentinelAuthority {
    host: string;
    port: number;
}
export interface RedisClusterNode {
    host: string;
    port: number;
}
