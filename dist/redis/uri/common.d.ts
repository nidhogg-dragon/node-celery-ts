import { Uri } from "../../uri";
export interface RedisQueryOptions {
    noDelay?: boolean;
    password?: string;
}
export declare const parseRedisQuery: (uri: Uri) => RedisQueryOptions;
