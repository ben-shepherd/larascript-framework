import { IAlterTableOptions } from "@src/core/domains/database/interfaces/postgres/IPostgresAlterTableOptions";
import { DataTypes, QueryInterfaceCreateTableOptions, QueryInterfaceDropTableOptions } from "sequelize";
import { ModelAttributes } from 'sequelize/types/model';

import { IDatabaseAdapter } from "../database/interfaces/IDatabaseAdapter";
import { IDatabaseAdapterSchema } from "../database/interfaces/IDatabaseAdapterSchema";
import PostgresAdapter from "./adapters/PostgresAdapter";

class PostgresSchema implements IDatabaseAdapterSchema {

    protected adapter!: PostgresAdapter;

    constructor(adapter: PostgresAdapter) {
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
        const client = await this.adapter.getPgClientDatabase('postgres');
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
        const client = await this.adapter.getPgClientDatabase('postgres');
        await client.connect()
        const result = await client.query(`SELECT FROM pg_database WHERE datname = '${name}'`)
        const dbExists = typeof result.rowCount === 'number' && result.rowCount > 0
        await client.end()
        return dbExists
    }
    
    /**
         * Drops the specified database.
         * 
         * @param name - The name of the database to drop.
         * @returns A promise that resolves when the database has been dropped.
         */
    async dropDatabase(name: string): Promise<void> {
        const client = await this.adapter.getPgClientDatabase('postgres');

        try {
            await client.connect();
            
            // Terminate any remaining connections to the target database
            await client.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity 
                WHERE pg_stat_activity.datname = $1
                AND pid <> pg_backend_pid()
            `, [name]);
    
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
    protected withIdSchema(attributes: ModelAttributes): ModelAttributes {
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
        const sequelize = this.adapter.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.createTable(tableName, this.withIdSchema(attributes), optons);
    }

    /**
     * Drop a table
     * @param tableName 
     * @param options 
     */
    async dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): Promise<void> {
        const sequelize = this.adapter.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropTable(tableName, options);
    }

    /**
     * Alters a table
     * @param tableName 
     * @param options 
     */
    async alterTable(tableName: IAlterTableOptions['tableName'], options: Omit<IAlterTableOptions, 'tableName'>): Promise<void> {
        const sequelize = this.adapter.getClient();
    
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
        const sequelize = this.adapter.getClient();
        const queryInterface = sequelize.getQueryInterface();
        return await queryInterface.tableExists(tableName);
    }

    /**
     * Drop all tables in the database
     */
    async dropAllTables(): Promise<void> {
        const sequelize = this.adapter.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropAllTables();
    }

}

export default PostgresSchema