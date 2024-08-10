import { Db, MongoClient } from 'mongodb';

import Service from '@src/core/base/Service';
import { Connection } from '@src/core/domains/Database/mongodb/interfaces/IMongoDbConfig';
import IMongoDBConnection from '@src/core/domains/Database/mongodb/interfaces/IMongoDBConnection';

export default class MongoDBConnection extends Service<Connection> implements IMongoDBConnection {
    private client: MongoClient;
    private db!: Db;

    constructor({ uri, options }: Connection) {
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