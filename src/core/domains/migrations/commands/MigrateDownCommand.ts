import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

class MigrateDownCommand extends BaseCommand {

    /**
     * Signature for the command.
     */
    public signature: string = 'migrate:down';

    /**
     * Constructor.
     * @param config
     */
    constructor(config: IMigrationConfig = {}) {
        super(config);
        // Allow for configurable keepProcessAlive for testing purposes
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }

    /**
     * Execute the command.
     */
    execute = async () => {
        // Read the arguments
        const batch = this.getArguementByKey('batch')?.value;
        
        // Run the migrations
        const service = new MigrationService(this.config);
        await service.boot();
        await service.down({ batch: batch ? parseInt(batch) : undefined }); 
    }

}

export default MigrateDownCommand
