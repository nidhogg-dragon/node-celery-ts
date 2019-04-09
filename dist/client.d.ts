import { FailoverStrategy } from "./config";
import { MessageBroker } from "./message_broker";
import { ResultBackend } from "./result_backend";
import { Task } from "./task";
export declare class Client {
    private readonly backend;
    private readonly brokers;
    private readonly id;
    private readonly taskDefaults;
    private readonly failoverStrategy;
    constructor({ backend, brokers, failoverStrategy, id, taskDefaults, }: ClientOptions);
    createTask<T>(name: string): Task<T>;
    disconnect(): Promise<void>;
    end(): Promise<void>;
}
export interface ClientOptions {
    backend?: ResultBackend;
    brokers: Array<MessageBroker>;
    failoverStrategy?: FailoverStrategy;
    id: string;
    taskDefaults?: TaskDefaults;
}
export interface TaskDefaults {
    deliveryMode?: "persistent" | "transient";
    hardTimeLimit?: number;
    queue?: string;
    softTimeLimit?: number;
}
export declare const getRoundRobinStrategy: (size: number) => FailoverStrategy;
