import { Db, MongoClient, MongoClientOptions } from 'mongodb';

import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import MongoDBSchema from '@src/core/domains/database/schema/MongoDBSchema';
import MongoDbDocumentManager from '@src/core/domains/database/documentManagers/MongoDbDocumentManager';
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseGenericConnectionConfig';

export default class MongoDB implements IDatabaseProvider {
    protected client!: MongoClient;
    protected db!: Db;

    /**
     * Constructor for MongoDB class
     * @param {IDatabaseGenericConnectionConfig} config - Configuration object containing URI and options for MongoDB connection
     */
    constructor({ uri, options = {} }: IDatabaseGenericConnectionConfig<MongoClientOptions>) {
        this.client = new MongoClient(uri, options);
    }

    /**
     * Get the MongoDB client instance
     * @returns {MongoClient} The MongoDB client
     */
    getClient(): MongoClient {
        return this.client;
    }

    /**
     * Connect to the MongoDB database
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    async connect(): Promise<void> {
        if (this.isConnected()) {
            return;
        }

        await this.client.connect();
        this.db = this.client.db();
    }

    /**
     * Get a query interface for MongoDB
     * @returns {IDocumentManager} An instance of MongoDBQuery
     */
    documentManager(): IDocumentManager {
        return new MongoDbDocumentManager(this);
    }

    /**
     * Get a schema interface for MongoDB
     * @returns {IDatabaseSchema} An instance of MongoDBSchema
     */
    schema(): IDatabaseSchema {
        return new MongoDBSchema(this);
    }

    /**
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    isConnected(): boolean {
        return this.db instanceof Db;
    }

    /**
     * Get the MongoDB database instance
     * @returns {Db} The MongoDB database instance
     */
    getDb(): Db {
        return this.db;
    }
}