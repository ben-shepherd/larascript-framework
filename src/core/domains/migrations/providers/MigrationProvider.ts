import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import MigrateDownCommand from "@src/core/domains/migrations/commands/MigrateDownCommand";
import MigrateUpCommand from "@src/core/domains/migrations/commands/MigrateUpCommand";

class MigrationProvider extends BaseProvider
{
    async register(): Promise<void>
    {
        console.log('Registering MigrationProvider');   

        App.container('console').register().registerAll([
            MigrateUpCommand,
            MigrateDownCommand
        ])
    }

    async boot(): Promise<void> 
    {
        console.log('Registering MigrationProvider');   
    }
}

export default MigrationProvider