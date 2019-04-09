export interface Uri {
    readonly authority?: Authority;
    readonly path: string;
    readonly query?: Queries;
    readonly raw: string;
    readonly scheme: string;
}
export declare enum Scheme {
    Amqp = "amqp",
    AmqpSecure = "amqps",
    Redis = "redis",
    RedisSecure = "rediss",
    RedisSentinel = "sentinel",
    RedisSentinelSecure = "sentinels",
    RedisSocket = "redis+socket",
    RedisSocketSecure = "rediss+socket",
    Rpc = "rpc",
    RpcSecure = "rpcs"
}
export interface Authority {
    readonly userInfo?: UserInfo;
    readonly host: string;
    readonly port?: number;
}
export interface Queries {
    readonly [key: string]: string | Array<string> | undefined;
}
export interface UserInfo {
    readonly user: string;
    readonly pass?: string;
}
export declare const parseUri: (toParse: string) => Uri;
export declare const getScheme: (rawUri: string) => Scheme;
