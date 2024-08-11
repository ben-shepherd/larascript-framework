import MongoDBConnection from "@src/core/domains/database/mongodb/services/MongoDBConnection";

export interface IConnections {
    [key: string]: MongoDBConnection
}