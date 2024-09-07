import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

class MigrateUpCommand extends BaseCommand {

    public signature: string = 'migrate:up';


    constructor(config: IMigrationConfig = {}) {
        super(config);
        // Allow for configurable keepProcessAlive for testing purposes
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }

    execute = async () => {
        const file = this.getArguementByKey('file')?.value;
        const group = this.getArguementByKey('group')?.value;

        const service = new MigrationService(this.config);
        await service.boot();
        await service.up({ filterByFileName: file, group });
    }

}

export default MigrateUpCommand