import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";

import MigrationTypeEnum from "../enums/MigrationTypeEnum";
import MigrationError from "../exceptions/MigrationError";
import { IMigrationService } from "../interfaces/IMigrationService";


abstract class BaseMigrationCommand extends BaseCommand {

    config!: IMigrationConfig;

    /**
     * Constructor
     * @param config
     */
    constructor(config: IMigrationConfig = {}) {
        super(config);
        this.keepProcessAlive = config?.keepProcessAlive ?? this.keepProcessAlive;
    }

    /**
     * Get the migration service for schema migrations
     * @returns
     */
    getSchemaMigrationService(): IMigrationService {
        if(typeof this.config.schemaMigrationDir !== 'string') {
            throw new MigrationError('Schema migration directory is not set');
        }

        return new MigrationService({
            migrationType: MigrationTypeEnum.schema,
            directory: this.config.schemaMigrationDir
        });
    }

    /**
     * Get the migration service for seeder migrations
     * @returns An instance of IMigrationService configured for seeder migrations
     */
    getSeederMigrationService(): IMigrationService {
        if(typeof this.config.seederMigrationDir !== 'string') {
            throw new MigrationError('Seeder migration directory is not set');
        }

        return new MigrationService({
            migrationType: MigrationTypeEnum.seeder,
            directory: this.config.seederMigrationDir
        });
    }


}

export default BaseMigrationCommand
