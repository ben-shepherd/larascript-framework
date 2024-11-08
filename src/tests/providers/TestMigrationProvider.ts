import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";

class TestMigrationProvider extends MigrationProvider {

    protected config: IMigrationConfig = {
        schemaMigrationDir: '@src/../src/tests/migrations/migrations',
        seederMigrationDir: '@src/../src/tests/migrations/seeders',
    };

}

export default TestMigrationProvider