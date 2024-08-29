import { Db, MongoClient } from 'mongodb';

import Service from '@src/core/base/Service';
import { IMongoDBConfig } from '../../exceptions/mongodb/IMongoDBConfig';
import IMongoDBConnection from '../../exceptions/mongodb/IMongoDBConnection';

export default class MongoDBConnection extends Service<IMongoDBConfig> implements IMongoDBConnection {
    private client: MongoClient;
    private db!: Db;

    constructor({ uri, options }: IMongoDBConfig) {
        super({ uri, options });
        this.client = new MongoClient(uri, options);
    }

    public async connect(): Promise<void> {
        if(this.isConnected()) {
            return;
        }
        
        await this.client.connect();
        this.db = this.client.db();
    }

    public isConnected(): boolean {
        return this.db instanceof Db;
    }

    public getClient(): MongoClient {
        return this.client;
    }

    public getDb(): Db {
        return this.db;
    }
}