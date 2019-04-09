import { RedisOptions } from "./options";
import { ResultMessage } from "../messages";
import { GetOptions, ResultBackend } from "../result_backend";
export declare class RedisBackend implements ResultBackend {
    private static readonly TIMEOUT;
    private static readonly UUID_REGEX;
    private static readonly UUID_INDEX;
    private readonly options;
    private readonly pool;
    private readonly results;
    private readonly subscriber;
    constructor(options?: RedisOptions);
    put<T>(message: ResultMessage<T>): Promise<string>;
    get<T>({ taskId, timeout }: GetOptions): Promise<ResultMessage<T>>;
    delete(taskId: string): Promise<string>;
    disconnect(): Promise<void>;
    end(): Promise<void>;
    uri(): string;
    private onMessage;
}
