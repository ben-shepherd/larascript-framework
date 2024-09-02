import { Db, MongoClient } from 'mongodb';

import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseQuery } from '@src/core/domains/database/interfaces/IDatabaseQuery';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { IMongoDBConfigConnection } from '@src/core/domains/database/interfaces/mongodb/IMongoDBConfigConnection';
import MongoDBQuery from '@src/core/domains/database/query/MongoDBQuery';
import MongoDBSchema from '@src/core/domains/database/schema/MongoDBSchema';

export default class MongoDB implements IDatabaseProvider {
    protected client!: MongoClient;
    protected db!: Db;
 
    /**
     * Constructor for MongoDB class
     * @param {IMongoDBConfigConnection} config - Configuration object containing URI and options for MongoDB connection
     */
    constructor({ uri, options = {} }: IMongoDBConfigConnection) {
        this.client = new MongoClient(uri, options);
    }

    /**
     * Get the MongoDB client instance
     * @returns {MongoClient} The MongoDB client
     */
    getClient(): MongoClient 
    {
        return this.client;
    }

    /**
     * Connect to the MongoDB database
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    async connect(): Promise<void> 
    {
        if(this.isConnected()) {
            return;
        }
        
        await this.client.connect();
        this.db = this.client.db();
    }

    /**
     * Get a query interface for MongoDB
     * @returns {IDatabaseQuery} An instance of MongoDBQuery
     */
    query(): IDatabaseQuery
    {
        return new MongoDBQuery(this);
    }

    /**
     * Get a schema interface for MongoDB
     * @returns {IDatabaseSchema} An instance of MongoDBSchema
     */
    schema(): IDatabaseSchema 
    {
        return new MongoDBSchema(this);
    }

    /**
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    isConnected(): boolean 
    {
        return this.db instanceof Db;
    }

    /**
     * Get the MongoDB database instance
     * @returns {Db} The MongoDB database instance
     */
    getDb(): Db 
    {
        return this.db;
    }
}