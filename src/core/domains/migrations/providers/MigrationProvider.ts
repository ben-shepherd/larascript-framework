import BaseProvider from "@src/core/base/Provider";
import MigrateDownCommand from "@src/core/domains/migrations/commands/MigrateDownCommand";
import MigrateUpCommand from "@src/core/domains/migrations/commands/MigrateUpCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import { App } from "@src/core/services/App";

/**
 * MigrationProvider class handles all migration related tasks
 */
class MigrationProvider extends BaseProvider {

    /**
     * The default configuration for the migrations
     */
    protected config: IMigrationConfig = {
        appMigrationsDir: '@src/../src/app/migrations',
    };
    
    /**
     * Registers the migration commands and adds them to the console service
     * with the default configuration
     */
    async register(): Promise<void> {
        this.log('Registering MigrationProvider');   

        App.container('console').register().registerAll([
            MigrateUpCommand,
            MigrateDownCommand
        ], this.config)
    }

    /**
     * Currently does nothing
     */
    async boot(): Promise<void> {
        this.log('Registering MigrationProvider');   
    }

}

export default MigrationProvider
