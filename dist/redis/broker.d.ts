import { RedisOptions } from "./options";
import { MessageBroker } from "../message_broker";
import { TaskMessage } from "../messages";
export declare class RedisBroker implements MessageBroker {
    private readonly options;
    private readonly connection;
    constructor(options?: RedisOptions);
    disconnect(): Promise<void>;
    end(): Promise<void>;
    publish(message: TaskMessage): Promise<string>;
}
