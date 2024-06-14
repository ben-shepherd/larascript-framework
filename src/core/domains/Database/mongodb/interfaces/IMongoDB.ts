import { Db, MongoClient } from 'mongodb';
import { IConnections } from './IConnections';

export interface IMongoDB {
    connect(connectionName: keyof IConnections): Promise<void>
    getClient(connectionName?: keyof IConnections): MongoClient
    getDb(connectionName?: string): Db
}