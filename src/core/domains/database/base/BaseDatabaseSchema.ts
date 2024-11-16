/* eslint-disable no-unused-vars */
import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

/**
 * Abstract base class for database schema operations
 * @template Provider - Type extending IDatabaseProvider
 */
abstract class BaseDatabaseSchema<Provider extends IDatabaseProvider = IDatabaseProvider> implements IDatabaseSchema {

    /**
     * Protected property to hold the database driver instance
     */
    protected adapter!: Provider;

    /**
     * Constructor for BaseDatabaseSchema
     * @param driver - Database provider instance
     */
    constructor(driver: Provider) {
        this.adapter = driver;
    }

    /**
     * Create a new database on the server
     * 
     * @returns A promise that resolves when the database is created
     */
    abstract createDatabase(name: string): Promise<void>;

    /**
     * Checks if a database exists
     * @param name The name of the database
     */
    abstract databaseExists(name: string): Promise<boolean>;

    /**
     * Drop (delete) a database from the server
     * @param name - Name of the database to drop
     * @returns A promise that resolves when the database is dropped
     */
    abstract dropDatabase(name: string): Promise<void>;

    /**
     * Abstract method to alter (modify) a table from the database
     * @param name - Name of the table to drop
     * @param args - Additional arguments for table deletion
     */
    abstract alterTable(...args: any[]): Promise<void>;

    /**
     * Abstract method to create a new table in the database
     * @param name - Name of the table to create
     * @param args - Additional arguments for table creation
     */
    abstract createTable(...args: any[]): void;

    /**
     * Abstract method to drop (delete) a table from the database
     * @param name - Name of the table to drop
     * @param args - Additional arguments for table deletion
     */
    abstract dropTable(...args: any[]): void;

    /**
     * Abstract method to check if a table exists in the database
     * @param name - Name of the table to check
     * @returns Promise resolving to a boolean indicating whether the table exists
     */
    abstract tableExists(name: string): Promise<boolean>;

    /**
     * Abstract method to drop all tables in the database
     */
    abstract dropAllTables(): Promise<void>;

}

export default BaseDatabaseSchema