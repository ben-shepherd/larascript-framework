import { IMigrationConfig } from "@src/core/domains/migrations/interfaces/IMigrationConfig";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";
import TestMigrationModel from "@src/tests/larascript/migration/models/TestMigrationModel";

class TestMigrationProvider extends MigrationProvider {

    protected config: IMigrationConfig = {
        keepProcessAlive: true,
        schemaMigrationDir: '@src/../src/tests/migration/migrations',
        seederMigrationDir: '@src/../src/tests/migration/seeders',
        modelCtor: TestMigrationModel
    }
    
}

export default TestMigrationProvider