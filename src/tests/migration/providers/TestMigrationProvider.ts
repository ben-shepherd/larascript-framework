import MigrateDownCommand from "@src/core/domains/migrations/commands/MigrateDownCommand";
import MigrateUpCommand from "@src/core/domains/migrations/commands/MigrateUpCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";
import { App } from "@src/core/services/App";
import TestMigrationModel from "@src/tests/migration/models/TestMigrationModel";

class TestMigrationProvider extends MigrationProvider {

    protected config: IMigrationConfig = {};
    
    async register(): Promise<void> {
        super.register();

        /**
         * Add configuration to adjust the directory in which the migrations are stored
         */
        const config: IMigrationConfig = {
            keepProcessAlive: true,
            appMigrationsDir: '@src/../src/tests/migration/migrations',
            modelCtor: TestMigrationModel
        }

        App.container('console').register().addCommandConfig([
            (new MigrateUpCommand).signature,
            (new MigrateDownCommand).signature
        ], config)
    }

}

export default TestMigrationProvider