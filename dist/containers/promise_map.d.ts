export declare class PromiseMap<K, V> {
    private promises;
    private data;
    private readonly timeout?;
    constructor(timeout?: number);
    has(key: K): boolean;
    isPending(key: K): boolean;
    isFulfilled(key: K): boolean;
    isRejected(key: K): boolean;
    resolve(key: K, value: V | PromiseLike<V>): boolean;
    reject(key: K, reason?: any): boolean;
    rejectAll(reason?: any): number;
    get(key: K): Promise<V>;
    delete(key: K): boolean;
    clear(): number;
    private settle;
    private resolveExisting;
    private resolveNew;
    private rejectExisting;
    private rejectNew;
    private doResolve;
    private setStatus;
    private setTimeout;
    private doDelete;
}
