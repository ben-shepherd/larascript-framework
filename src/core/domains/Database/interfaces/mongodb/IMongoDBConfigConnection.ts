import { MongoClientOptions } from "mongodb";

export interface IMongoDBConfigConnection {
    driver: 'mongodb';
    uri: string,
    options: MongoClientOptions
}