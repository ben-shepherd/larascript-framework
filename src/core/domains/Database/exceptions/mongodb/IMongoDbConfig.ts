import { MongoClientOptions } from "mongodb";


export interface IMongoDBConfig {
    uri: string,
    options: MongoClientOptions
}