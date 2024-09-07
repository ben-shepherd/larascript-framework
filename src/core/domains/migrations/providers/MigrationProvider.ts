import BaseProvider from "@src/core/base/Provider";
import MigrateDownCommand from "@src/core/domains/migrations/commands/MigrateDownCommand";
import MigrateUpCommand from "@src/core/domains/migrations/commands/MigrateUpCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import { App } from "@src/core/services/App";

class MigrationProvider extends BaseProvider
{
    protected config: IMigrationConfig = {
        appMigrationsDir: '@src/../src/app/migrations',
    };
    
    async register(): Promise<void>
    {
        console.log('Registering MigrationProvider');   

        App.container('console').register().registerAll([
            MigrateUpCommand,
            MigrateDownCommand
        ])

        App.container('console').register().addCommandConfig([
            (new MigrateUpCommand).signature,
            (new MigrateDownCommand).signature
        ], this.config)
    }

    async boot(): Promise<void> 
    {
        console.log('Registering MigrationProvider');   
    }
}

export default MigrationProvider