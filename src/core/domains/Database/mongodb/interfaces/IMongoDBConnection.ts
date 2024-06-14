import { MongoClient, Db } from "mongodb";

export default interface IMongoDBConnection {
    connect(): Promise<any>;
    isConnected(): boolean;
    getClient(): MongoClient;
    getDb(): Db;
}