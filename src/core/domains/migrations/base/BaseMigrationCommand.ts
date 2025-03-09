import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import MigrationTypeEnum from "@src/core/domains/migrations/enums/MigrationTypeEnum";
import MigrationError from "@src/core/domains/migrations/exceptions/MigrationError";
import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import { IMigrationService } from "@src/core/domains/migrations/interfaces/IMigrationService";
import MigrationService from "@src/core/domains/migrations/services/MigrationService";


abstract class BaseMigrationCommand extends BaseCommand {

    protected config!: IMigrationConfig;

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
            directory: this.config.schemaMigrationDir,
            modelCtor: this.config.modelCtor,
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
            directory: this.config.seederMigrationDir,
            modelCtor: this.config.modelCtor,
        });
    }


}

export default BaseMigrationCommand
