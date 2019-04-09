export declare class ResourcePool<T> {
    private readonly create;
    private readonly destroy;
    private readonly emptyEmitter;
    private inUse;
    private readonly maxResources;
    private unused;
    private resourceCount;
    private waiting;
    constructor(create: () => T | PromiseLike<T>, destroy: (resource: T) => string | PromiseLike<string>, maxResources: number);
    numOwned(): number;
    numInUse(): number;
    numUnused(): number;
    use<U>(f: (resource: T) => U | PromiseLike<U>): Promise<U>;
    get(): Promise<T>;
    returnAfter<U>(promise: U | PromiseLike<U>, resource: T): Promise<U>;
    return(resource: T): void;
    destroyAll(): Promise<Array<string>>;
    private getResource;
}
