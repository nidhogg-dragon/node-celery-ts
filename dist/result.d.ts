import { ResultBackend } from "./result_backend";
export declare class Result<T> {
    private readonly backend;
    private readonly taskId;
    private readonly result;
    constructor(taskId: string, backend: ResultBackend);
    get(timeout?: number): Promise<T>;
    delete(): Promise<string>;
    private getResult;
}
