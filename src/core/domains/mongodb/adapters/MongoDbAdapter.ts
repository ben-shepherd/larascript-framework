import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";
import { Db, MongoClient, MongoClientOptions, MongoServerError } from "mongodb";

import BaseDatabaseAdapter from "../../database/base/BaseDatabaseAdapter";
import CreateDatabaseException from "../../database/exceptions/CreateDatabaseException";
import { IDatabaseSchema } from "../../database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "../../database/interfaces/IDocumentManager";
import ParseMongoDBConnectionString from "../helper/ParseMongoDBConnectionUrl";
import { IMongoConfig } from "../interfaces/IMongoConfig";
import MongoDbDocumentManager from "../MongoDbDocumentManager";
import MongoDbSchema from "../MongoDbSchema";

class MongoDbAdapter extends BaseDatabaseAdapter<MongoClient, IMongoConfig>  {

    protected db!: Db;

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
    
    async connect(): Promise<void> {
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
    async connectToDatabase(database: string = 'app', options: object = {}): Promise<MongoClient> {
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

            await this.schema().createDatabase(database);
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
 
    getDocumentManager(): IDocumentManager {
        return new MongoDbDocumentManager(this)
    }

    getSchema(): IDatabaseSchema {
        return new MongoDbSchema(this)
    }

    getQueryBuilderCtor(): ICtor<unknown> {
        throw new Error("Method not implemented.");
    }   

}

export default MongoDbAdapter