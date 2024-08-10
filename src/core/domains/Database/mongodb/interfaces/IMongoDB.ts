import { IConnections } from '@src/core/domains/Database/mongodb/interfaces/IConnections';
import { Db, MongoClient } from 'mongodb';

export interface IMongoDB {
    init(): void;
    connect(connectionName: keyof IConnections): Promise<void>;
    getClient(connectionName?: keyof IConnections): MongoClient;
    getDb(connectionName?: string): Db;
    connectDefaultConnection(): Promise<void>;
    connectKeepAlive(): Promise<void>;
}