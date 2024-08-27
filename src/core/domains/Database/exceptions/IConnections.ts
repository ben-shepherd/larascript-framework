import MongoDBConnection from "@src/core/domains/database/services/mongodb/MongoDBConnection";

export interface IConnections {
    [key: string]: MongoDBConnection
}