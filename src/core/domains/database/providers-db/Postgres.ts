
import { EnvironmentProduction } from '@src/core/consts/Environment';
import PostgresDocumentManager from '@src/core/domains/database/documentManagers/PostgresDocumentManager';
import InvalidSequelize from '@src/core/domains/database/exceptions/InvalidSequelize';
import ParsePostgresConnectionUrl from '@src/core/domains/database/helper/ParsePostgresConnectionUrl';
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseGenericConnectionConfig';
import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import PostgresSchema from '@src/core/domains/database/schema/PostgresSchema';
import { App } from '@src/core/services/App';
import pg from 'pg';
import { QueryInterface, Sequelize } from 'sequelize';
import { Options, Options as SequelizeOptions } from 'sequelize/types/sequelize';

export default class Postgres implements IDatabaseProvider {

    public connectionName!: string;

    protected sequelize!: Sequelize;

    protected config!: IDatabaseGenericConnectionConfig<SequelizeOptions>;

    /**
     * Override config
     * This fixes an issue where a SQL select query string did not keep the casing of the provided table name.
     * When the select query string is buit, it's now wrapped around double quotes which ensures the casing of the table name.
     */
    protected overrideConfig: Partial<Options> = {
        quoteIdentifiers: true,
        dialectModule: pg
    }
 
    /**
     * Constructor for Postgres
     * @param connectionName - The connection name
     * @param config - The configuration object
     */
    constructor(connectionName: string, config: IDatabaseGenericConnectionConfig<SequelizeOptions>) {
        this.connectionName = connectionName;
        this.config = config;
    }

    getClient(): Sequelize {
        return this.sequelize;
    }

    /**
     * Connect to the MongoDB database
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    async connect(): Promise<void> {
        await this.createDefaultDatabase();
        
        this.sequelize = new Sequelize(this.config.uri, { 
            logging: App.env() !== EnvironmentProduction,
            ...this.config.options, 
            ...this.overrideConfig
        })
    }

    /**
     * Creates the default database if it does not exist
     * @returns {Promise<void>} A promise that resolves when the default database has been created
     * @throws {Error} If an error occurs while creating the default database
     * @private
     */
    private async createDefaultDatabase(): Promise<void> {
        const credentials = ParsePostgresConnectionUrl.parse(this.config.uri);
        
        const client = new pg.Client({
            user: credentials.username,
            password: credentials.password,
            host: credentials.host,
            port: credentials.port,
            database: 'postgres'
        });
        
        try {
            await client.connect();

            const result = await client.query(`SELECT FROM pg_database WHERE datname = '${credentials.database}'`)
            const dbExists = typeof result.rowCount === 'number' && result.rowCount > 0

            if(dbExists) {
                return;
            }

            await client.query('CREATE DATABASE ' + credentials.database);
        }
        catch (err) {
            App.container('logger').error(err);
        }
        finally {
            await client.end();
        }
    }

    /**
     * Get a query interface for MongoDB
     * @returns {IDocumentManager} An instance of MongoDBQuery
     */
    documentManager(): IDocumentManager {
        return new PostgresDocumentManager(this);
    }

    /**
     * Get a schema interface for MongoDB
     * @returns {IDatabaseSchema} An instance of MongoDBSchema
     */
    schema(): IDatabaseSchema {
        return new PostgresSchema(this);
    }

    /**
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    isConnected(): boolean {
        return this.sequelize instanceof Sequelize;
    }

    /**
     * Get the sequelize instance
     * @returns 
     */
    getSequelize(): Sequelize {
        if(!this.sequelize) {
            throw new InvalidSequelize('Sequelize is not connected');
        }

        return this.sequelize
    }

    /**
     * Get a new PostgreSQL client instance.
     * 
     * @returns {pg.Client} A new instance of PostgreSQL client.
     */
    getPgClient(): pg.Client {
        return new pg.Client(this.config.uri);
    }

    getPgClientDatabase(database: string = 'postgres'): pg.Client {
        const { username: user, password, host, port} = ParsePostgresConnectionUrl.parse(this.config.uri);

        return new pg.Client({
            user,
            password,
            host,
            port,
            database
        });
    }

    /**
     * Get the query interface for the database
     * @returns {QueryInterface} The query interface
     */
    getQueryInterface(): QueryInterface {
        return this.getSequelize().getQueryInterface();
    }


}