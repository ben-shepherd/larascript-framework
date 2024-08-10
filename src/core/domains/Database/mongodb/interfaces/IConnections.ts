import MongoDBConnection from "@src/core/domains/Database/mongodb/services/MongoDBConnection";

export interface IConnections {
    [key: string]: MongoDBConnection
}