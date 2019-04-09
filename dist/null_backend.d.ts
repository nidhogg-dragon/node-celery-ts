import { ResultMessage } from "./messages";
import { ResultBackend } from "./result_backend";
export declare class NullBackend implements ResultBackend {
    constructor();
    put(): Promise<string>;
    get<T>(): Promise<ResultMessage<T>>;
    delete(): Promise<string>;
    disconnect(): Promise<void>;
    end(): Promise<void>;
    uri(): never;
}
