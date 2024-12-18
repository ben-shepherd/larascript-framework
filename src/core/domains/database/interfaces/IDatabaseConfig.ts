import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { ICtor } from "@src/core/interfaces/ICtor";

export interface IDatabaseGenericConnectionConfig<Options extends object = object> {
    connectionName: string;
    adapter: ICtor<IDatabaseAdapter>;
    uri: string,
    options: Options;
}

export interface IDatabaseConfig {
    enableLogging?: boolean;
    onBootConnect?: boolean;
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: IDatabaseGenericConnectionConfig[];
}

