import { Client } from "./client";
import { MessageBroker } from "./message_broker";
import { ResultBackend } from "./result_backend";
export declare const createClient: ({ brokerUrl, resultBackend }: {
    brokerUrl: string | string[];
    resultBackend?: string | undefined;
}) => Client;
export declare const createBackend: (id: string, rawUri: string) => ResultBackend;
export declare const createBroker: (rawUri: string) => MessageBroker;
