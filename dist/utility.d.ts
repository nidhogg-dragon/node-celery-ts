/// <reference types="node" />
import * as Events from "events";
export declare const parseInteger: (maybeInt: string) => number;
export declare const parseBoolean: (maybeBoolean: string) => boolean;
export declare const isNullOrUndefined: <T>(value: T | null | undefined) => value is null | undefined;
export declare const isNull: <T>(value: T | null) => value is null;
export declare const isUndefined: <T>(value: T | undefined) => value is undefined;
export declare const toCamelCase: (toConvert: string) => string;
export declare const promisifyEvent: <T>(emitter: Events.EventEmitter, name: string | symbol) => Promise<T>;
export declare const filterMapEvent: <T>({ emitter, filterMap, name }: {
    emitter: Events.EventEmitter;
    filterMap(...args: any[]): T | undefined;
    name: string | symbol;
}) => Promise<T>;
export declare const createTimeoutPromise: <T>(promise: T | PromiseLike<T>, timeout?: number | undefined) => Promise<T>;
export declare const createTimerPromise: (timeout: number) => Promise<never>;
