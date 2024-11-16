import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapter } from "./IDatabaseAdapter";

export interface IDatabaseGenericConnectionConfig<Options extends object = object> {
    connectionName: string;
    adapter: string;
    uri: string,
    options: Options;
}

export interface IDatabaseConfig {
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: IDatabaseGenericConnectionConfig[];
    adapters: IDatabaseAdapterConfig[]
}


export interface IDatabaseAdapterConfig
{
    name: string;
    package: string;
    adapter: ICtor<IDatabaseAdapter>;
}