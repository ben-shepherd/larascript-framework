
import BaseMigrationCommand from "@src/core/domains/migrations/base/BaseMigrationCommand";

/**
 * MigrateUpCommand class handles running up migrations
 */
class MigrateUpCommand extends BaseMigrationCommand {

    /**
     * The signature of the command
     */
    public signature: string = 'migrate:up';

    description = 'Run up migrations';


    /**
     * Execute the command
     */
    async execute() {
        // Read the arguments
        const file = this.getArguementByKey('file')?.value;
        const group = this.getArguementByKey('group')?.value;

        // Run the migrations
        const schemaMigrationService = this.getSchemaMigrationService();
        await schemaMigrationService.boot();
        await schemaMigrationService.up({ filterByFileName: file, group: group });
    }

}

export default MigrateUpCommand
