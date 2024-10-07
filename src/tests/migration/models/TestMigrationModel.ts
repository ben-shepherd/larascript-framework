import MigrationModel, { MigrationModelData } from "@src/core/domains/migrations/models/MigrationModel";

/**
 * Model for test migrations stored in the database.
 */
class TestMigrationModel extends MigrationModel {

    constructor(data: MigrationModelData | null) {
        super(data, 'testMigrations');
    }

}

/**
 * The default migration model.
 */
export default TestMigrationModel
