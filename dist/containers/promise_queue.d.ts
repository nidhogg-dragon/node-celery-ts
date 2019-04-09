export declare class PromiseQueue<T> {
    private queue;
    constructor();
    push(): Promise<T>;
    resolveAll(value: T | PromiseLike<T>): number;
    rejectAll(reason?: any): number;
    resolveOne(value: T | PromiseLike<T>): boolean;
    rejectOne(reason?: any): boolean;
    private settleOne;
}
