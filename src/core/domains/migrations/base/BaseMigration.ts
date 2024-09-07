import { IMigration } from "@src/core/domains/migrations/interfaces/IMigration";
import { App } from "@src/core/services/App";

/**
 * BaseMigration class serves as the foundation for all database migrations.
 * It implements the IMigration interface and provides core functionality
 * for database operations and migration control.
 */
abstract class BaseMigration implements IMigration
{
    /**
     * schema is used for database table operations like creating, altering, or dropping tables.
     * It's retrieved from the database connection in the App container.
     */
    protected readonly schema = App.container('db').schema();

    /**
     * documentManager is used for CRUD operations on database documents or records.
     * It handles inserting, updating, fetching, and deleting database documents.
     */
    protected readonly documentManager = App.container('db').documentManager()

    /**
     * databaseProvider specifies which database system this migration is designed for.
     * If undefined, the migration will run on the default provider.
     * Can be set to 'mongodb', 'postgres', or other supported database systems.
     */
    databaseProvider?: string | undefined;

    /**
     * Implements the forward migration logic.
     * This method should be overridden in child classes to define
     * the specific changes to be applied to the database.
     * @throws Error if not implemented in the child class
     */
    up(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Implements the rollback logic for the migration.
     * This method should be overridden in child classes to define
     * how to revert the changes made by the 'up' method.
     * @throws Error if not implemented in the child class
     */
    down(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Determines whether this migration should be executed.
     * @returns true if the migration should run, false otherwise
     */
    shouldUp(): boolean
    {
        // If no specific database provider is set, the migration runs on the default provider
        if(!this.databaseProvider) { 
            return true;
        }

        // Check if the current database matches the specified provider for this migration
        return App.container('db').isProvider(this.databaseProvider);
    }
}

export default BaseMigration;