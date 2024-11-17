import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { ICtor } from "@src/core/interfaces/ICtor";

/**
 * The type of migration
 */
export type MigrationType = 'schema' | 'seeder';

export interface IMigration {

    /**
     * This should be set only if this migration should run on a specific database provider
     */
    databaseAdapter?:  ICtor<IDatabaseAdapter>;

    /**
     * Specify the group this migration belongs to
     */
    group?: string;

    /**
     * Specify the type of migration
     */
    migrationType: 'schema' | 'seeder';

    /**
     * Run the migrations up
     */
    up(): Promise<void>

    /**
     * Run the migrations down
     */
    down(): Promise<void>

    /**
     * Check if the current database provider matches databaseProvider
     */
    shouldUp(): boolean;
}