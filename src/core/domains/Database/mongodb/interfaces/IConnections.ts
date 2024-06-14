import MongoDBConnection from "../services/MongoDBConnection";

export interface IConnections {
    [key: string]: MongoDBConnection
}