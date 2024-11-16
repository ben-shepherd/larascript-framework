/* eslint-disable no-unused-vars */


import { IDatabaseAdapter } from "./IDatabaseAdapter";

/**
 * Interface for database schema operations
 */
export interface IDatabaseAdapterSchema {

    /**
     * Set the database adapter
     * @param adapter 
     */
    setAdapter(adapter: IDatabaseAdapter): void;

    /**
     * Creates a new database schema.
     * If the database already exists, this method does nothing.
     * If the database does not exist, this method creates a new database schema.
     * @returns A promise that resolves when the database schema has been created.
     */
    createDatabase(name: string): Promise<void>;

    /**
     * Checks if a database exists
     * @param name The name of the database
     */
    databaseExists(name: string): Promise<boolean>;

    /**
     * Drops the database schema.
     * If the database does not exist, this method does nothing.
     * If the database exists, this method drops the database schema.
     * @returns A promise that resolves when the database schema has been dropped.
     */
    dropDatabase(name: string): Promise<void>;

    /**
     * Create a table in the database
     * @param name - Name of the table to create
     * @param args - Additional arguments for table creation
     */
    createTable(name: string, ...args: any[]): void;

    /**
     * Drop (delete) a table from the database
     * @param name - Name of the table to drop
     * @param args - Additional arguments for table deletion
     */
    dropTable(name: string, ...args: any[]): void;

    /**
     * Check if a table exists in the database
     * @param name - Name of the table to check
     * @returns Promise resolving to a boolean indicating whether the table exists
     */
    tableExists(name: string): Promise<boolean>;
    
    /**
     * Alter a table in the database
     * @param name - Name of the table to alter
     * @param args - Additional arguments for table alteration
     * @returns Promise resolving to void
     * @throws Error if the method is not implemented
     */
    alterTable(name: string, ...args: any[]): Promise<void>

    /**
     * Drop all tables in the database
     */
    dropAllTables(): Promise<void>;
}
