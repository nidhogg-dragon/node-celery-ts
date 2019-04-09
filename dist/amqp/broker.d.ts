import { AmqpOptions } from "./options";
import { MessageBroker } from "../message_broker";
import { TaskMessage } from "../messages";
export declare class AmqpBroker implements MessageBroker {
    private channels;
    private readonly connection;
    private readonly options;
    constructor(options?: AmqpOptions);
    disconnect(): Promise<void>;
    end(): Promise<void>;
    publish(message: TaskMessage): Promise<string>;
    private static getBody;
    private static getPublishOptions;
    private static assert;
    private static doPublish;
}
