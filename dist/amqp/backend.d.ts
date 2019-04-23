import { ResultMessage } from "../messages";
import { GetOptions, ResultBackend } from "../result_backend";
import { AmqpOptions } from "./options";
export declare class RpcBackend implements ResultBackend {
    private readonly channels;
    private readonly connection;
    private readonly consumer;
    private readonly consumerTag;
    private readonly options;
    private readonly promises;
    private readonly routingKey;
    constructor(routingKey: string, options?: AmqpOptions);
    put<T>(message: ResultMessage<T>): Promise<string>;
    get<T>({ taskId, timeout }: GetOptions): Promise<ResultMessage<T>>;
    delete(taskId: string): Promise<string>;
    disconnect(): Promise<void>;
    end(): Promise<void>;
    uri(): never;
    private static parseMessage;
    private static createPublishOptions;
    private assertQueue;
    private sendToQueue;
    private createConsumer;
    private onMessage;
}
