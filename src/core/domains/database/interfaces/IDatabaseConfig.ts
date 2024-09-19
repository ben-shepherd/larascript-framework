import { IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseGenericConnectionConfig";

export interface IDatabaseConfig {
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: {
        [key: string]: IDatabaseGenericConnectionConfig
    }
}

