
import PostgresDocumentManager from '@src/core/domains/database/documentManagers/PostgresDocumentManager';
import InvalidSequelize from '@src/core/domains/database/exceptions/InvalidSequelize';
import { IDatabaseGenericConnectionConfig } from '@src/core/domains/database/interfaces/IDatabaseGenericConnectionConfig';
import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { IDocumentManager } from '@src/core/domains/database/interfaces/IDocumentManager';
import PostgresSchema from '@src/core/domains/database/schema/PostgresSchema';
import { QueryInterface, Sequelize } from 'sequelize';
import { Options as SequelizeOptions } from 'sequelize/types/sequelize';

export default class Postgres implements IDatabaseProvider {

    public connectionName!: string;

    protected sequelize!: Sequelize;

    protected config!: IDatabaseGenericConnectionConfig<SequelizeOptions>;

    /**
     * Override config
     * This fixes an issue where a SQL select query string did not keep the casing of the provided table name.
     * When the select query string is buit, it's now wrapped around double quotes which ensures the casing of the table name.
     */
    protected overrideConfig = {
        quoteIdentifiers: true
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
        this.sequelize = new Sequelize(this.config.uri, { ...this.config.options, ...this.overrideConfig })
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

    getQueryInterface(): QueryInterface {
        return this.getSequelize().getQueryInterface();
    }

}