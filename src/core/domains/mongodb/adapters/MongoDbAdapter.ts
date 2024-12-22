import BaseDatabaseAdapter from "@src/core/domains/database/base/BaseDatabaseAdapter";
import CreateDatabaseException from "@src/core/domains/database/exceptions/CreateDatabaseException";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { db } from "@src/core/domains/database/services/Database";
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import ParseMongoDBConnectionString from "@src/core/domains/mongodb/helper/ParseMongoDBConnectionUrl";
import { IMongoConfig } from "@src/core/domains/mongodb/interfaces/IMongoConfig";
import MongoDbSchema from "@src/core/domains/mongodb/MongoDbSchema";
import createMigrationSchemaMongo from "@src/core/domains/mongodb/schema/createMigrationSchemaMongo";
import { extractDefaultMongoCredentials } from "@src/core/domains/mongodb/utils/extractDefaultMongoCredentials";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import { Db, MongoClient, MongoClientOptions, MongoServerError } from "mongodb";

import MongoDbEloquent from "../eloquent/MongoDbEloquent";

class MongoDbAdapter extends BaseDatabaseAdapter<IMongoConfig>  {

    /**
    * The MongoDB database instance
     */
    protected db!: Db;

    /**
     * The MongoDB client instance
     */
    protected client!: MongoClient;

    /**
     * Constructor for PostgresAdapter
     * @param config The configuration object containing the uri and options for the PostgreSQL connection
     */
    constructor(connectionName: string, config: IMongoConfig) {
        super()
        this.setConnectionName(connectionName);
        this.setConfig(config);
    }

    /**
     * Retrieves the name of the docker-compose file for MongoDB
     * @returns {string} The name of the docker-compose file
     */
    getDockerComposeFileName(): string {
        return 'docker-compose.mongodb.yml'
    }

    /**
     * Returns the default MongoDB credentials extracted from the docker-compose file.
     * 
     * @returns {string | null} The default MongoDB credentials, or null if they could not be extracted.
     */
    getDefaultCredentials(): string | null {
        return extractDefaultMongoCredentials()
    }

    getClient(): MongoClient {
        if(!this.client) {
            throw new Error('MongoDB client is not connected');
        }
        return this.client
    }

    /**
     * Get the MongoDB database instance
     * @returns {Db} The MongoDB database instance
     */
    getDb(): Db {
        if(!this.client) {
            throw new Error('MongoDB client is not connected');
        }
        return this.client.db();
    }

    /**
     * Connect to the PostgreSQL database
     *
     * Creates the default database if it does not exist
     * and sets up the Sequelize client
     *
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    
    async connectDefault(): Promise<void> {
        if (await this.isConnected()) {
            return;
        }

        await this.createDefaultDatabase()
        
        const { uri, options } = this.config

        this.client = new MongoClient(uri, options as MongoClientOptions);
        this.db = this.client.db();
    }
    

    /**
     * Connect to a specific PostgreSQL database.
     *
     * @param database - The name of the database to connect to.
     * @returns {Promise<pg.Client>} A promise that resolves with a new instance of PostgreSQL client.
     */
    async getMongoClientWithDatabase(database: string = 'app', options: object = {}): Promise<MongoClient> {
        const { host, port, username, password, options: mongoOptions } = ParseMongoDBConnectionString.parse(this.config.uri); 

        const newCredentials = new ParseMongoDBConnectionString({
            host,
            port,
            username,
            password,
            database,
            options: mongoOptions
        })

        const uri = newCredentials.toString();
        
        const client = new MongoClient(uri, options)

        try {
            await client.connect();
        }
        catch (err) {
            App.container('logger').error('Error connecting to database: ' + (err as Error).message);

            if(err instanceof MongoServerError === false) {
                throw err
            }
        }

        return client
    }

    /**
     * Creates the default database if it does not exist
     * @returns {Promise<void>} A promise that resolves when the default database has been created
     * @throws {Error} If an error occurs while creating the default database
     * @private
     */
    private async createDefaultDatabase(): Promise<void> {
        try {
            const { database } = ParseMongoDBConnectionString.parse(this.config.uri);

            if(!database) {
                throw new CreateDatabaseException('Database name not found in connection string');
            }

            await db().schema().createDatabase(database);
        }
        catch (err) {
            App.container('logger').error(err);
        }
    }
        
    /**
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    async isConnected(): Promise<boolean> {
        return this.db instanceof Db;
    }

    /**
     * Gets the schema interface for the database.
     * 
     * @returns {IDatabaseSchema} The schema interface.
     */
    getSchema(): IDatabaseSchema {
        return new MongoDbSchema(this.connectionName)
    }

    getEloquentConstructor<Model extends IModel>(): ICtor<IEloquent<Model>> {
        return MongoDbEloquent as unknown as ICtor<IEloquent<Model>>
    }

    createMigrationSchema(tableName: string): Promise<unknown> {
        return createMigrationSchemaMongo(this, tableName)
    }

    async close(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default MongoDbAdapter