import { Db, MongoClient } from 'mongodb';

import { IMongoDBConfig } from '@src/core/domains/database/exceptions/mongodb/IMongoDBConfig';
import { IDatabaseDriver } from '@src/core/domains/database/interfaces/IDatabaseDriver';
import { IDatabaseQuery } from '@src/core/domains/database/interfaces/IDatabaseQuery';
import MongoDBQuery from '@src/core/domains/database/query/MongoDBQuery';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import MongoDBSchema from '@src/core/domains/database/schema/MongoDBSchema';

export default class MongoDB implements IDatabaseDriver {
    protected client!: MongoClient;
    protected db!: Db;
 
    constructor({ uri, options = {} }: IMongoDBConfig) {
        this.client = new MongoClient(uri, options);
    }

    getClient(): MongoClient 
    {
        throw this.client;
    }

    async connect(): Promise<void> 
    {
        if(this.isConnected()) {
            return;
        }
        
        await this.client.connect();
        this.db = this.client.db();
    }

    query(): IDatabaseQuery
    {
        return new MongoDBQuery(this);
    }

    schema(): IDatabaseSchema 
    {
        return new MongoDBSchema(this);
    }

    isConnected(): boolean 
    {
        return this.db instanceof Db;
    }

    getDb(): Db 
    {
        return this.db;
    }
}