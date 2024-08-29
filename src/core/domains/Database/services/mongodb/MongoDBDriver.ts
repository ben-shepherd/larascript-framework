import { Db, MongoClient } from 'mongodb';

import { IMongoDBConfig } from '../../exceptions/mongodb/IMongoDBConfig';
import { IDatabaseDriver } from '../../interfaces/IDatabaseDriver';
import { IDatabaseQuery } from '../../interfaces/IDatabaseQuery';
import MongoDBQuery from '../../query/MongoDBQuery';

export default class MongoDBDriver implements IDatabaseDriver {
    protected client!: MongoClient;
    protected db!: Db;

    constructor({ uri, options = {} }: IMongoDBConfig) {
        this.client = new MongoClient(uri, options);
    }
    public getClient(): MongoClient {
        throw this.client;
    }

    public async connect(): Promise<void> {
        if(this.isConnected()) {
            return;
        }
        
        await this.client.connect();
        this.db = this.client.db();
    }

    public query(): IDatabaseQuery
    {
        return new MongoDBQuery(this);
    }

    public isConnected(): boolean {
        return this.db instanceof Db;
    }

    public getDb(): Db {
        return this.db;
    }
}