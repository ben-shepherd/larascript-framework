
import BaseMigrationCommand from "../base/BaseMigrationCommand";

class SeedCommand extends BaseMigrationCommand {

    /**
     * The signature of the command
     */
    public signature: string = 'db:seed';

    description = 'Run all seeders';


    /**
     * Execute the command
     */
    async execute() {
        // Read the arguments
        const file = this.getArguementByKey('file')?.value;
        const group = this.getArguementByKey('group')?.value;

        // Run the migrations
        const schemaMigrationService = this.getSeederMigrationService();
        await schemaMigrationService.boot();
        await schemaMigrationService.up({ filterByFileName: file, group: group });
    }

}

export default SeedCommand
