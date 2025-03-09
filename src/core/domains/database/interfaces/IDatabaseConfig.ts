import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";

export interface IDatabaseGenericConnectionConfig<Options extends object = object> {
    connectionName: string;
    adapter: TClassConstructor<IDatabaseAdapter>;
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

