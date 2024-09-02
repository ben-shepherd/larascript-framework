import { MongoClientOptions } from "mongodb";

export interface IMongoDBConfigConnection {
    driver: string;
    uri: string,
    options: MongoClientOptions
}