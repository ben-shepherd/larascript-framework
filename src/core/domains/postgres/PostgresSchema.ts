import BaseSchema from "@src/core/domains/database/base/BaseSchema";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseAdapterSchema } from "@src/core/domains/database/interfaces/IDatabaseAdapterSchema";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";
import { IAlterTableOptions } from "@src/core/domains/postgres/interfaces/IPostgresAlterTableOptions";
import pg from 'pg';
import { DataTypes, QueryInterfaceCreateTableOptions, QueryInterfaceDropTableOptions } from "sequelize";
import { ModelAttributes } from 'sequelize/types/model';

import { logger } from "../logger/services/LoggerService";


class PostgresSchema extends BaseSchema implements IDatabaseAdapterSchema {

    protected adapter!: PostgresAdapter;

    constructor(adapter: PostgresAdapter) {
        super()
        this.adapter = adapter;
    }

    /**
     * Sets the PostgreSQL adapter.
     * @param adapter - The PostgresAdapter instance to set.
     */
    setAdapter(adapter: IDatabaseAdapter): void {
        this.adapter = adapter as unknown as PostgresAdapter
    }

    /**
     * Creates a new database schema.
     * @param name The name of the database to create
     * @returns A promise that resolves when the database schema has been created
     */
    async createDatabase(name: string): Promise<void> {
        const client = await this.adapter.getPgClientWithDatabase('postgres');
        try {
            await client.connect()
            await client.query(`CREATE DATABASE ${name}`)
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {}
        finally {
            await client.end()
        }
    }
    
    /**
         * Checks if a database exists
         * @param name The name of the database to check
         * @returns A promise that resolves to a boolean indicating whether the database exists
         */
    async databaseExists(name: string): Promise<boolean> {
        const client = await this.adapter.getPgClientWithDatabase('postgres');
        await client.connect()
        const result = await client.query(`SELECT FROM pg_database WHERE datname = '${name}'`)
        const dbExists = typeof result.rowCount === 'number' && result.rowCount > 0
        await client.end()
        return dbExists
    }

    /**
     * Terminates any remaining connections to a PostgreSQL database.
     * @param database The name of the database to terminate connections to.
     * @param client An optional pg.Client instance to use. If not provided, a new client will be created and closed after use.
     * @returns A promise that resolves when the connections have been terminated.
     */
    async terminateConnections(database: string, client?: pg.Client): Promise<void> {
        const endConnection: boolean = typeof client === 'undefined';
        client = client ?? await this.adapter.getPgClientWithDatabase(database);
        
        try {
        // Terminate any remaining connections to the target database
            await client.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity 
            WHERE pg_stat_activity.datname = $1
            AND pid <> pg_backend_pid()
            `, [database]);
        }
        catch (err) {
            logger().error(`Failed to terminate connections to database ${database}: ${(err as Error).message}`);
        }
        finally {
            if(endConnection) {
                await client.end();
            }
        }
    }
    
    /**
     * Drops the specified database.
     * 
     * @param name - The name of the database to drop.
     * @returns A promise that resolves when the database has been dropped.
     */
    async dropDatabase(name: string): Promise<void> {

        const client = await this.adapter.getPgClientWithDatabase('postgres');

        try {
            await client.connect();
            
            // Terminate any remaining connections to the target database
            await this.terminateConnections(name, client);
    
            // Drop the database
            await client.query(`DROP DATABASE IF EXISTS "${name}"`);
        }
        catch (err) {
            throw new Error(`Failed to drop database ${name}: ${(err as Error).message}`);
        }
        finally {
            // Clean up the pg client
            await client.end();
        }
    }

    /**
     * Ensure id property is added to attributes
     * @param attributes 
     * @returns 
     */
    protected withDefaultUuuidV4Schema(attributes: ModelAttributes): ModelAttributes {
        if(attributes['id'] === undefined) {
            return {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                ...attributes,
            }
        }

        return attributes
    }

    /**
     * Create a table (id property is optional and is automatically added if not present)
     * @param tableName 
     * @param attributes 
     * @param optons 
     */
    async createTable(tableName: string, attributes: ModelAttributes, optons?: QueryInterfaceCreateTableOptions): Promise<void> {
        const sequelize = this.adapter.getSequelize();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.createTable(tableName, this.withDefaultUuuidV4Schema(attributes), optons);
    }

    /**
     * Drop a table
     * @param tableName 
     * @param options 
     */
    async dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): Promise<void> {
        const sequelize = this.adapter.getSequelize();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropTable(tableName, options);
    }

    /**
     * Alters a table
     * @param tableName 
     * @param options 
     */
    async alterTable(tableName: IAlterTableOptions['tableName'], options: Omit<IAlterTableOptions, 'tableName'>): Promise<void> {
        const sequelize = this.adapter.getSequelize();
    
        if(options.addColumn) {
            await sequelize.getQueryInterface().addColumn(
                tableName,
                options.addColumn.key,
                options.addColumn.attribute,
                options.addColumn.options
            );
        }
        if(options.removeColumn) {
            await sequelize.getQueryInterface().removeColumn(
                tableName,
                options.removeColumn.attribute,
                options.removeColumn.options
            )
        }
        if(options.changeColumn) {
            await sequelize.getQueryInterface().changeColumn(
                tableName,
                options.changeColumn.attributeName,
                options.changeColumn.dataTypeOrOptions,
                options.changeColumn.options
            );
        }
        if(options.renameColumn) {
            await sequelize.getQueryInterface().renameColumn(
                tableName,
                options.renameColumn.attrNameBefore,
                options.renameColumn.attrNameAfter,
                options.renameColumn.options
            );
        }
        if(options.addIndex) {
            await sequelize.getQueryInterface().addIndex(
                tableName,
                options.addIndex.attributes,
                options.addIndex.options
            );
        }
        if(options.removeIndex) {
            await sequelize.getQueryInterface().removeIndex(
                tableName,
                options.removeIndex.indexName,
                options.removeIndex.options
            );
        }
    }

    /**
     * Check if table exists
     * @param tableName 
     * @returns 
     */
    async tableExists(tableName: string): Promise<boolean> {
        const sequelize = this.adapter.getSequelize();
        const queryInterface = sequelize.getQueryInterface();
        return await queryInterface.tableExists(tableName);
    }

    /**
     * Drop all tables in the database
     */
    async dropAllTables(): Promise<void> {
        const sequelize = this.adapter.getSequelize();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropAllTables();
    }

}

export default PostgresSchema