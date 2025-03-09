import BaseProvider from "@src/core/base/Provider";
import MigrateDownCommand from "@src/core/domains/migrations/commands/MigrateDownCommand";
import MigrateFreshCommand from "@src/core/domains/migrations/commands/MigrateFreshCommand";
import MigrateUpCommand from "@src/core/domains/migrations/commands/MigrateUpCommand";
import SeedUpCommand from "@src/core/domains/migrations/commands/SeedUpCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import { app } from "@src/core/services/App";
import SeedDownCommand from "@src/core/domains/migrations/commands/SeedDownCommand";

/**
 * MigrationProvider class handles all migration related tasks
 */
class MigrationProvider extends BaseProvider {

    protected config: IMigrationConfig = {
        schemaMigrationDir: '@src/../src/app/migrations',
        seederMigrationDir: '@src/../src/app/seeders',
    };
    
    async register(): Promise<void> {
        this.log('Registering MigrationProvider');   

        // Register the migration commands
        app('console').registerService()
            .registerAll([
                MigrateUpCommand,
                MigrateDownCommand,
                MigrateFreshCommand,
                SeedUpCommand,
                SeedDownCommand,
            ], this.config)
    }

}

export default MigrationProvider
