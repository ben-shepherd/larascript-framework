import { IMongoDBConfigConnection } from "@src/core/domains/database/interfaces/mongodb/IMongoDBConfigConnection";

export interface IDatabaseConfigConnection {
    [key: string]: IMongoDBConfigConnection
};

export interface IDatabaseConfig {
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: IDatabaseConfigConnection
}

