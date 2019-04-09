/// <reference types="node" />
export interface AmqpOptions {
    channelMax?: number;
    frameMax?: number;
    heartbeat?: number;
    hostname: string;
    locale?: string;
    password?: string;
    port?: number;
    protocol: string;
    username?: string;
    vhost?: string;
}
export interface SocketOptions {
    ca?: Array<Buffer>;
    cert?: Buffer;
    key?: Buffer;
    passphrase?: string;
}
export declare const DEFAULT_AMQP_OPTIONS: AmqpOptions;
