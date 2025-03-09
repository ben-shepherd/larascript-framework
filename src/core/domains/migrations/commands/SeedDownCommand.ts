
import BaseMigrationCommand from "@src/core/domains/migrations/base/BaseMigrationCommand";

class SeedCommand extends BaseMigrationCommand {

    /**
     * The signature of the command
     */
    public signature: string = 'db:seed:down';

    description = 'Rollback seeders. Usage: db:seed:down --file=filename --group=group';


    /**
     * Execute the command
     */
    async execute() {
        // Read the arguments
        const file = this.getArguementByKey('file')?.value;
        const group = this.getArguementByKey('group')?.value;
        const batch = this.getArguementByKey('batch')?.value;

        // Run the migrations
        const schemaMigrationService = this.getSeederMigrationService();
        await schemaMigrationService.boot();
        await schemaMigrationService.down({ filterByFileName: file, group: group, batch: batch ? parseInt(batch) : undefined });

        this.input.writeLine('Seeds down successfully');
    }

}

export default SeedCommand
