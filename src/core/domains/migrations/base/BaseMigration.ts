import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { db } from "@src/core/domains/database/services/Database";
import { IMigration, MigrationType } from "@src/core/domains/migrations/interfaces/IMigration";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import { AppSingleton } from "@src/core/services/App";

/**
 * BaseMigration class serves as the foundation for all database migrations.
 * It implements the IMigration interface and provides core functionality
 * for database operations and migration control.
 */
abstract class BaseMigration implements IMigration {

    /**
     * schema is used for database table operations like creating, altering, or dropping tables.
     * It's retrieved from the database connection in the App container.
     */
    protected readonly schema = AppSingleton.container('db').schema();

    /**
     * Define the type of migration.
     */
    migrationType = 'schema' as MigrationType;

    /**
     * databaseProvider specifies which database system this migration is designed for.
     * If undefined, the migration will run on the default provider.
     * Can be set to 'mongodb', 'postgres', or other supported database systems.
     */
    databaseAdapter?: TClassConstructor<IDatabaseAdapter>;

    /**
     * Define the name of the migration group.
     * Allows filterable migrations with --group=<group-name>
     */
    group?: string;

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
    shouldUp(): boolean {
        // If no specific database provider is set, the migration runs on the default provider
        if (!this.databaseAdapter) {
            return true;
        }

        // Check if the current database matches the specified provider for this migration
        return db().isConnectionAdapter(this.databaseAdapter);
    }

}

export default BaseMigration;