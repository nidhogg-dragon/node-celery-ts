import { ResultMessage } from "./messages";
export interface ResultBackend {
    put<T>(message: ResultMessage<T>): Promise<string>;
    get<T>({ taskId, timeout }: GetOptions): Promise<ResultMessage<T>>;
    delete(taskId: string): Promise<string>;
    disconnect(): Promise<void>;
    end(): Promise<void>;
    uri(): string;
}
export interface GetOptions {
    taskId: string;
    timeout?: number;
}
