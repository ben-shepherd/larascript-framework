import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";

class MigrateUpCommand extends BaseCommand {

    public signature: string = 'migrate:down';

    constructor(config: IMigrationConfig = {}) {
        super(config);
        // Allow for configurable keepProcessAlive for testing purposes
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }


    execute = async () => {
        const batch = this.getArguementByKey('batch')?.value;
        const service = new MigrationService(this.config);
        await service.boot();
        await service.down({ batch: batch ? parseInt(batch) : undefined }); 
    }

}

export default MigrateUpCommand