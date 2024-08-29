import { Db, MongoClient } from 'mongodb';
import { IConnections } from '@src/core/domains/database/exceptions/IConnections';

export interface IMongoDB {
    init(): void;
    connect(connectionName: keyof IConnections): Promise<void>;
    getClient(connectionName?: keyof IConnections): MongoClient;
    getDb(connectionName?: string): Db;
    connectDefaultConnection(): Promise<void>;
    connectKeepAlive(): Promise<void>;
}