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
    protected driver!: Provider;

    /**
     * Constructor for BaseDatabaseSchema
     * @param driver - Database provider instance
     */
    constructor(driver: Provider) {
        this.driver = driver;
    }

    alterTable(name: string, ...args: any[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Abstract method to create a new table in the database
     * @param name - Name of the table to create
     * @param args - Additional arguments for table creation
     */
    abstract createTable(name: string, ...args: any[]): void;

    /**
     * Abstract method to drop (delete) a table from the database
     * @param name - Name of the table to drop
     * @param args - Additional arguments for table deletion
     */
    abstract dropTable(name: string, ...args: any[]): void;

    /**
     * Abstract method to check if a table exists in the database
     * @param name - Name of the table to check
     * @returns Promise resolving to a boolean indicating whether the table exists
     */
    abstract tableExists(name: string): Promise<boolean>;

}

export default BaseDatabaseSchema