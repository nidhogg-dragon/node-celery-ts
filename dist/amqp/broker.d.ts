import { MessageBroker } from "../message_broker";
import { TaskMessage } from "../messages";
import { AmqpOptions } from "./options";
export declare class AmqpBroker implements MessageBroker {
    private channels;
    private connection;
    private readonly options;
    private reconnecting;
    constructor(options?: AmqpOptions);
    disconnect(): Promise<void>;
    end(): Promise<void>;
    reconnect(): Promise<void>;
    publish(message: TaskMessage): Promise<string>;
    private static getBody;
    private static getPublishOptions;
    private static assert;
    private static doPublish;
}
