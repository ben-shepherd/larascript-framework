import BaseConfig from "@src/core/base/BaseConfig";
import { EnvironmentProduction } from "@src/core/consts/Environment";
import { ICtor } from "@src/core/interfaces/ICtor";
import { App } from "@src/core/services/App";
import pg from 'pg';
import { Sequelize } from "sequelize";

import ParsePostgresConnectionUrl from "../../database/helper/ParsePostgresConnectionUrl";
import { IDatabaseAdapter } from "../../database/interfaces/IDatabaseAdapter";
import { IDatabaseSchema } from "../../database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "../../database/interfaces/IDocumentManager";
import { IPostgresConfig } from "../interfaces/IPostgresConfig";

class PostgresAdapter extends BaseConfig implements IDatabaseAdapter  {

    protected config!: IPostgresConfig;

    /**
     * todo: future refactor this to pg.Client
     */
    protected client!: Sequelize;

    /**
     * Constructor for PostgresAdapter
     * @param config The configuration object containing the uri and options for the PostgreSQL connection
     */
    constructor(config: IPostgresConfig) {
        super()
        this.setConfig(config);   
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
        
        this.client = new Sequelize(this.config.uri, { 
            logging: App.env() !== EnvironmentProduction,
            ...this.config.options, 
            ...this.overrideConfig
        })
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
    isConnected(): boolean {
        return this.sequelize instanceof Sequelize;
    }
 
    getDocumentManager(): IDocumentManager {
        throw new Error("Method not implemented.");
    }

    getSchema(): IDatabaseSchema {
        throw new Error("Method not implemented.");
    }

    getClient(): unknown {
        throw new Error("Method not implemented.");
    }

    getQueryBuilderCtor(): ICtor<unknown> {
        throw new Error("Method not implemented.");
    }   

}

export default PostgresAdapter