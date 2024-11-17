import { EnvironmentProduction } from "@src/core/consts/Environment";
import BaseDatabaseAdapter from "@src/core/domains/database/base/BaseDatabaseAdapter";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import InvalidSequelizeException from "@src/core/domains/postgres/exceptions/InvalidSequelizeException";
import ParsePostgresConnectionUrl from "@src/core/domains/postgres/helper/ParsePostgresConnectionUrl";
import { IPostgresConfig } from "@src/core/domains/postgres/interfaces/IPostgresConfig";
import PostgresDocumentManager from "@src/core/domains/postgres/PostgresDocumentManager";
import PostgresSchema from "@src/core/domains/postgres/PostgresSchema";
import createMigrationSchemaPostgres from "@src/core/domains/postgres/schema/createMigrationSchemaPostgres";
import { extractDefaultPostgresCredentials } from "@src/core/domains/postgres/utils/extractDefaultPostgresCredentials";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";
import pg from 'pg';
import { QueryInterface, Sequelize } from "sequelize";

class PostgresAdapter extends BaseDatabaseAdapter<Sequelize, IPostgresConfig>  {

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
     * Get the name of the docker-compose file for Postgres
     * @returns {string} The name of the docker-compose file
     */
    getDockerComposeFileName(): string {
        return 'docker-compose.postgres.yml'
    }

    /**
     * Returns the default Postgres credentials extracted from the docker-compose file
     * @returns {string | null} The default Postgres credentials
     */
    getDefaultCredentials(): string | null {
        return extractDefaultPostgresCredentials();
    }

    /**
     * Get the query interface for the database
     * @returns {QueryInterface} The query interface
     */
    getQueryInterface(): QueryInterface {
        return this.getSequelize().getQueryInterface();
    }
    
    /**
     * Get the sequelize instance
     * @returns 
     */
    getSequelize(): Sequelize {
        if(!this.getClient()) {
            throw new InvalidSequelizeException('Sequelize is not connected');
        }
    
        return this.getClient()
    }


    /**
     * Get a new PostgreSQL client instance.
     * 
     * @returns {pg.Client} A new instance of PostgreSQL client.
     */
    getPgClient(): pg.Client {
        return new pg.Client(this.config.uri);
    }

    /**
     * Get a new PostgreSQL client instance connected to a specific database.
     * 
     * @param database - The name of the database to connect to. Defaults to 'postgres'
     * @returns {pg.Client} A new instance of PostgreSQL client.
     */
    async getPgClientDatabase(database: string = 'postgres'): Promise<pg.Client> {
        return this.connectToDatabase(database)
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
        await this.createDefaultDatabase()
        
        this.setClient(
            new Sequelize(this.config.uri, { 
                logging: App.env() !== EnvironmentProduction,
                ...this.config.options, 
                ...this.overrideConfig
            })
        )
    }

    /**
     * Connect to a specific PostgreSQL database.
     *
     * @param database - The name of the database to connect to.
     * @returns {Promise<pg.Client>} A promise that resolves with a new instance of PostgreSQL client.
     */
    async connectToDatabase(database: string): Promise<pg.Client> {
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

    getQueryBuilderCtor(): ICtor<unknown> {
        throw new Error("Method not implemented.");
    }   

    /**
     * Creates the migrations schema for the database
     * @param tableName The name of the table to create
     * @returns A promise that resolves when the schema has been created
     */
    createMigrationSchema(tableName: string): Promise<unknown> {
        return createMigrationSchemaPostgres(this, tableName)
    }

}

export default PostgresAdapter