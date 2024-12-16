import { EnvironmentProduction } from "@src/core/consts/Environment";
import BaseDatabaseAdapter from "@src/core/domains/database/base/BaseDatabaseAdapter";
import { IDatabaseGenericConnectionConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import PostgresEloquent from "@src/core/domains/postgres/eloquent/PostgresEloquent";
import ParsePostgresConnectionUrl from "@src/core/domains/postgres/helper/ParsePostgresConnectionUrl";
import { IPostgresConfig } from "@src/core/domains/postgres/interfaces/IPostgresConfig";
import PostgresDocumentManager from "@src/core/domains/postgres/PostgresDocumentManager";
import PostgresSchema from "@src/core/domains/postgres/PostgresSchema";
import createMigrationSchemaPostgres from "@src/core/domains/postgres/schema/createMigrationSchemaPostgres";
import { extractDefaultPostgresCredentials } from "@src/core/domains/postgres/utils/extractDefaultPostgresCredentials";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { App } from "@src/core/services/App";
import pg from 'pg';
import { QueryInterface, Sequelize } from "sequelize";



/**
 * PostgresAdapter is responsible for managing the connection and operations with a PostgreSQL database.
 * 
 * @class
 * @extends BaseDatabaseAdapter<IPostgresConfig>
 */
class PostgresAdapter extends BaseDatabaseAdapter<IPostgresConfig>  {

    /**
     * The name of the Docker Compose file associated with the database
     */
    protected dockerComposeFileName: string = 'docker-compose.postgres.yml';

    /**
     * The sequelize instance
     * Used as an alternative to help with managing the structure of the database and tables, and to provide a way to perform queries on the database.
     */
    protected sequelize!: Sequelize;

    /**
     * The pg Pool instance
     */
    protected pool!: pg.Pool;

    /**
     * Constructor for PostgresAdapter
     * @param config The configuration object containing the uri and options for the PostgreSQL connection
     */
    constructor(connectionName: string, config: IPostgresConfig) {
        super()
        this.setConnectionName(connectionName);
        this.setConfig(config);   
    }


    /**
     * Returns the default Postgres credentials extracted from the docker-compose file
     * @returns {string | null} The default Postgres credentials
     */
    getDefaultCredentials(): string | null {
        return extractDefaultPostgresCredentials();
    }

    /**
     * Gets the pg Pool instance
     * @returns {pg.Pool} The pool instance
     */
    getPool(): pg.Pool {
        return this.pool;
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
        await this.createDefaultDatabase()

        const { username: user, password, host, port, database} = ParsePostgresConnectionUrl.parse(this.config.uri);
        
        this.pool = (
            new pg.Pool({
                user,
                password,
                host,
                port,
                database
            })
        )
        await this.pool.connect();
    }

    /**
     * Creates the default database if it does not exist
     * @returns {Promise<void>} A promise that resolves when the default database has been created
     * @throws {Error} If an error occurs while creating the default database
     * @private
     */
    async createDefaultDatabase(): Promise<void> {
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
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    async isConnected(): Promise<boolean> {
        return this.client instanceof Sequelize;
    }
 
    /**
     * Get the document manager for database operations
     * @returns {IDocumentManager} The document manager instance
     */
    getDocumentManager(): IDocumentManager {
        return new PostgresDocumentManager(this)
    }

    /**
     * Gets the schema interface for the database
     * @returns {IDatabaseSchema} The schema interface
     */
    getSchema(): IDatabaseSchema {
        return new PostgresSchema(this)
    }

    /**
     * Retrieves the constructor for a Postgres query builder.
     *
     * @template Data The type of data to be queried, defaults to object.
     * @returns {ICtor<IEloquent<Data>>} The constructor of the query builder.
     */
    getEloquentConstructor<Model extends IModel>(): ICtor<IEloquent<Model>> {
        return PostgresEloquent as unknown as ICtor<IEloquent<Model>>
    }

    /**
     * Creates the migrations schema for the database
     * @param tableName The name of the table to create
     * @returns A promise that resolves when the schema has been created
     */
    createMigrationSchema(tableName: string): Promise<unknown> {
        return createMigrationSchemaPostgres(this, tableName)
    }

    /**
     * Get the query interface for the database
     * @returns {QueryInterface} The query interface
     */
    getSequelizeQueryInterface(): QueryInterface {
        return this.getSequelize().getQueryInterface();
    }
        
    /**
     * Get the sequelize instance
     * @returns 
     */
    getSequelize(): Sequelize {
        if(!this.sequelize) {
            this.sequelize = new Sequelize(this.config.uri, { 
                logging: App.env() !== EnvironmentProduction,
                ...this.config.options, 
                ...this.overrideConfig
            })
        }
    
        return this.sequelize
    }
    
    /**
     * Get a new PostgreSQL client instance.
     * 
     * @returns {pg.Client} A new instance of PostgreSQL client.
     */
    getPgClient(config: IDatabaseGenericConnectionConfig<IPostgresConfig> = this.config): pg.Client {
        return new pg.Client(config as object);
    }
    
    /**
     * Get a new PostgreSQL client instance connected to a specific database.
     * 
     * @param database - The name of the database to connect to. Defaults to 'postgres'
     * @returns {pg.Client} A new instance of PostgreSQL client.
     */
    getPgClientWithDatabase(database: string = 'postgres'): pg.Client {
        const { username: user, password, host, port} = ParsePostgresConnectionUrl.parse(this.config.uri);
    
        return new pg.Client({
            user,
            password,
            host,
            port,
            database
        });
    }
    
}

export default PostgresAdapter