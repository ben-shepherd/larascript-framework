import MongoDbDocumentManager from '@src/core/domains/database/documentManagers/MongoDbDocumentManager';
import CreateDatabaseException from '@src/core/domains/database/exceptions/CreateDatabaseException';
import ParseMongoDBConnectionString from '@src/core/domains/database/helper/ParseMongoDBConnectionUrl';
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseGenericConnectionConfig';
import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import MongoDBSchema from '@src/core/domains/database/schema/MongoDBSchema';
import { App } from '@src/core/services/App';
import { Db, MongoClient, MongoClientOptions, MongoServerError } from 'mongodb';

export default class MongoDB implements IDatabaseProvider {

    public connectionName!: string;

    protected client!: MongoClient;

    protected db!: Db;

    protected config!: Omit<IDatabaseGenericConnectionConfig<MongoClientOptions>, 'driver'>;

    /**
     * Constructor for MongoDB class
     * @param {IDatabaseGenericConnectionConfig} config - Configuration object containing URI and options for MongoDB connection
     */
    constructor(connectionName, { uri, options = {} }: IDatabaseGenericConnectionConfig<MongoClientOptions>) {
        this.connectionName = connectionName;
        this.client = new MongoClient(uri, options);
        this.config = { uri, options };
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

        await this.createDefaultDatabase()
        await this.client.connect();
        this.db = this.client.db();
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
     * Connect to a specific MongoDB database
     * @param database The name of the database to connect to. Defaults to 'app'
     * @param options The options to pass to the MongoClient constructor
     * @returns {Promise<MongoClient>} A promise that resolves with the MongoClient instance
     * @throws {Error} If an error occurs while connecting to the database
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
        if(!this.client) {
            throw new Error('MongoDB client is not connected');
        }
        return this.client.db();
    }

}