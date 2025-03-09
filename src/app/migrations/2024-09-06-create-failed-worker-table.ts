import FailedWorkerModel from "@src/core/domains/events/models/FailedWorkerModel";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import DataTypes from "@src/core/domains/migrations/schema/DataTypes";

export class CreateFailedWorkerTableMigration extends BaseMigration {

    // Specify the database provider if this migration should run on a particular database.
    // Uncomment and set to 'mongodb', 'postgres', or another supported provider.
    // If left commented out, the migration will run only on the default provider.
    // databaseProvider: 'mongodb' | 'postgres' = 'postgres';

    group?: string = 'app:setup';

    table = FailedWorkerModel.getTable();

    async up(): Promise<void> {
        await this.schema.createTable(this.table, {
            eventName: DataTypes.STRING,
            payload: DataTypes.JSON,
            error: DataTypes.STRING,
            createdAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(this.table)
    }

}