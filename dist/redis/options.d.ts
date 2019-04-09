import { BasicRedisClusterOptions, BasicRedisSentinelOptions, BasicRedisSocketOptions, BasicRedisTcpOptions } from "./basic_options";
import * as IoRedis from "ioredis";
export interface RedisOptions {
    createClient(override?: object): IoRedis.Redis;
    createUri(): string;
}
export declare class RedisTcpOptions implements RedisOptions {
    readonly options: BasicRedisTcpOptions;
    constructor(options: BasicRedisTcpOptions);
    createClient(override?: object): IoRedis.Redis;
    createUri(): string;
}
export declare class RedisSocketOptions implements RedisOptions {
    readonly options: BasicRedisSocketOptions;
    constructor(options: BasicRedisSocketOptions);
    createClient(override?: object): IoRedis.Redis;
    createUri(): string;
}
export declare class RedisSentinelOptions implements RedisOptions {
    readonly options: BasicRedisSentinelOptions;
    constructor(options: BasicRedisSentinelOptions);
    createClient(override?: object): IoRedis.Redis;
    createUri(): string;
}
export declare class RedisClusterOptions implements RedisOptions {
    readonly options: BasicRedisClusterOptions;
    constructor(options: BasicRedisClusterOptions);
    createClient(): IoRedis.Redis;
    createUri(): string;
}
export declare const DEFAULT_REDIS_OPTIONS: RedisTcpOptions;
export declare const createOptions: (options: NativeOptions) => RedisOptions;
export declare type NativeOptions = IoRedis.RedisOptions | BasicRedisClusterOptions;
