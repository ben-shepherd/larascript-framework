import { IDatabaseGenericConnectionConfig } from "./IDatabaseGenericConnectionConfig";

export interface IDatabaseConfig {
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: {
        [key: string]: IDatabaseGenericConnectionConfig
    }
}

