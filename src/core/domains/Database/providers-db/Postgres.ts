
import { IDatabaseProvider } from '@src/core/domains/database/interfaces/IDatabaseProvider';
import { IDatabaseQuery } from '@src/core/domains/database/interfaces/IDatabaseQuery';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { Pool, PoolConfig } from 'pg';
import { QueryInterface, Sequelize } from 'sequelize';
import { Options as SequelizeOptions } from 'sequelize/types/sequelize';
import InvalidSequelize from '../exceptions/InvalidSequelize';
import { IDatabaseGenericConnectionConfig } from '../interfaces/IDatabaseGenericConnectionConfig';
import PostgresQuery from '../query/PostgresQuery';
import PostgresSchema from '../schema/PostgresSchema';

export default class Postgres implements IDatabaseProvider {
    protected pool!: Pool;
    protected sequelize!: Sequelize;
    protected config!: IDatabaseGenericConnectionConfig<SequelizeOptions>;
 
    /**
     * Constructor for MongoDB class
     * @param {PoolConfig} config - Configuration object containing URI and options for MongoDB connection
     */
    constructor(config: IDatabaseGenericConnectionConfig<SequelizeOptions>) {
        this.config = config;
    }

    getClient(): Sequelize 
    {
        return this.sequelize;
    }

    /**
     * Connect to the MongoDB database
     * @returns {Promise<void>} A promise that resolves when the connection is established
     */
    async connect(): Promise<void> 
    {
        this.sequelize = new Sequelize(this.config.uri, this.config.options)
    }

    /**
     * Get a query interface for MongoDB
     * @returns {IDatabaseQuery} An instance of MongoDBQuery
     */
    query(): IDatabaseQuery
    {
        return new PostgresQuery(this);
    }

    /**
     * Get a schema interface for MongoDB
     * @returns {IDatabaseSchema} An instance of MongoDBSchema
     */
    schema(): IDatabaseSchema 
    {
        return new PostgresSchema(this);
    }

    /**
     * Check if the database connection is established
     * @returns {boolean} True if connected, false otherwise
     */
    isConnected(): boolean 
    {
        return this.sequelize instanceof Sequelize;
    }

    /**
     * Get the sequelize instance
     * @returns 
     */
    getSequelize(): Sequelize
    {
        if(!this.sequelize) {
            throw new InvalidSequelize('Sequelize is not connected');
        }

        return this.sequelize
    }

    getQueryInterface(): QueryInterface
    {
        return this.getSequelize().getQueryInterface();
    }
}