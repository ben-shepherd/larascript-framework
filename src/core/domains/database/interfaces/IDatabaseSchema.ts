/* eslint-disable no-unused-vars */
/**
 * Interface for database schema operations
 */
export interface IDatabaseSchema {

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
