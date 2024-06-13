import { MongoClientOptions } from "mongodb";

export default interface IMongoDbConfig {
    connection: string;
    keepAliveConnections?: string[];
    connections: {
        [key: string]: Connection
    }
}

export interface Connection {
    uri: string,
    options: MongoClientOptions
}