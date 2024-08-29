import { IMongoDBConfigConnection } from "./mongodb/IMongoDBConfigConnection";

export interface IDatabaseConfigConnection {
    [key: string]: IMongoDBConfigConnection
};

export interface IDatabaseConfig {
    defaultConnectionName: string;
    keepAliveConnections: string;
    connections: IDatabaseConfigConnection
}

