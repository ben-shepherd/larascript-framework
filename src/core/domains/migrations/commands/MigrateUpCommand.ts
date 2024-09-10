import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

/**
 * MigrateUpCommand class handles running up migrations
 */
class MigrateUpCommand extends BaseCommand {

    /**
     * The signature of the command
     */
    public signature: string = 'migrate:up';

    /**
     * Constructor
     * @param config
     */
    constructor(config: IMigrationConfig = {}) {
        super(config);
        // Allow for configurable keepProcessAlive for testing purposes
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }

    /**
     * Execute the command
     */
    async execute() {
        // Read the arguments
        const file = this.getArguementByKey('file')?.value;
        const group = this.getArguementByKey('group')?.value;

        // Run the migrations
        const service = new MigrationService(this.config);
        await service.boot();
        await service.up({ filterByFileName: file, group });
    }

}

export default MigrateUpCommand
