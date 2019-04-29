import { MessageBroker } from "../message_broker";
import { TaskMessage } from "../messages";
import { AmqpOptions } from "./options";
export declare class AmqpBroker implements MessageBroker {
    private readonly channels;
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
