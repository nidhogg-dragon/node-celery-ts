export interface PromiseFunctions<T> {
    reject(reason?: any): void;
    resolve(value: T | PromiseLike<T>): void;
}
