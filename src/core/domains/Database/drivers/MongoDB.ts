import { Db, MongoClient } from 'mongodb';

import { IDatabaseDriver } from '@src/core/domains/database/interfaces/IDatabaseDriver';
import { IDatabaseQuery } from '@src/core/domains/database/interfaces/IDatabaseQuery';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import MongoDBQuery from '@src/core/domains/database/query/MongoDBQuery';
import MongoDBSchema from '@src/core/domains/database/schema/MongoDBSchema';
import { IMongoDBConfigConnection } from '../interfaces/mongodb/IMongoDBConfigConnection';

export default class MongoDB implements IDatabaseDriver {
    protected client!: MongoClient;
    protected db!: Db;
 
    constructor({ uri, options = {} }: IMongoDBConfigConnection) {
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