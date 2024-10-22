import { MigrationType } from "@src/core/domains/migrations/interfaces/IMigration";

import BaseMigration from "./BaseMigration";

/**
 * BaseSeeder class serves as the foundation for all database seeders.
 */
abstract class BaseSeeder extends BaseMigration {

    /**
     * The type of migration
     */
    migrationType = 'seeder' as MigrationType;

    /**
     * Optional down method.
     *
     * @return {Promise<void>}
     */
    down(): Promise<void> {
        return Promise.resolve();
    }

}

export default BaseSeeder;