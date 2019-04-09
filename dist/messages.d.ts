export interface ResultMessage<T> {
    children: Array<any>;
    result: T;
    status: Status;
    task_id: string;
    traceback: string | null;
}
export interface TaskMessage {
    body: string;
    "content-encoding": ContentEncodingMime;
    "content-type": ContentTypeMime;
    headers: TaskHeaders;
    properties: TaskProperties;
}
export interface TaskHeaders {
    group: string | null;
    id: string;
    lang: string;
    parent_id: string | null;
    root_id: string;
    task: string;
    argsrepr?: string;
    compression?: CompressionMime;
    eta?: string | null;
    expires?: string | null;
    kwargsrepr?: string;
    meth?: string;
    origin?: string;
    retries?: number;
    shadow?: string | null;
    timelimit?: [number | null, number | null];
}
export interface TaskProperties {
    body_encoding: "base64" | "utf-8";
    correlation_id: string;
    delivery_info: TaskDeliveryInfo;
    delivery_mode: 1 | 2;
    delivery_tag: string;
    priority: number;
    reply_to?: string;
}
export interface TaskDeliveryInfo {
    exchange: string;
    routing_key: string;
}
export declare enum Status {
    Failure = "FAILURE",
    Pending = "PENDING",
    Received = "RECEIVED",
    Retry = "RETRY",
    Revoked = "REVOKED",
    Started = "STARTED",
    Success = "SUCCESS"
}
export declare enum ContentTypeMime {
    Json = "application/json",
    Yaml = "application/x-yaml"
}
export declare enum ContentEncodingMime {
    Utf8 = "utf-8",
    Base64 = "base64"
}
export declare enum CompressionMime {
    Zlib = "application/x-gzip"
}
