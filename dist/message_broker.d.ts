import { TaskMessage } from "./messages";
export interface MessageBroker {
    disconnect(): Promise<void>;
    end(): Promise<void>;
    publish(message: TaskMessage): Promise<string>;
}
