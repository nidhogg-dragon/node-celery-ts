export declare class List<T> implements Iterable<T> {
    private head?;
    private tail?;
    private size;
    constructor();
    readonly length: number;
    static from<T>(init: Iterable<T>): List<T>;
    static of<T>(...elements: Array<T>): List<T>;
    push(...elements: Array<T>): number;
    pop(): T | undefined;
    shift(): T | undefined;
    unshift(...elements: Array<T>): number;
    [Symbol.iterator](): IterableIterator<T>;
    private pushOne;
    private unshiftOne;
}
