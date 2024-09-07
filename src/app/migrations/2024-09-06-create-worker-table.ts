import WorkerModel, { WorkerModelData } from "@src/core/domains/events/models/WorkerModel";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { DataTypes } from "sequelize";

export class CreateWorkerTableMigration extends BaseMigration {

    // Specify the database provider if this migration should run on a particular database.
    // Uncomment and set to 'mongodb', 'postgres', or another supported provider.
    // If left commented out, the migration will run only on the default provider.
    // databaseProvider: 'mongodb' | 'postgres' = 'postgres';

    table = (new WorkerModel({} as WorkerModelData)).table

    async up(): Promise<void> {
        await this.schema.createTable(this.table, {
            queueName: DataTypes.STRING,
            eventName: DataTypes.STRING,
            payload: DataTypes.JSON,
            attempt: DataTypes.INTEGER,
            retries: DataTypes.INTEGER,
            createdAt: DataTypes.DATE
        });
    }

    async down(): Promise<void> {
        await this.schema.dropTable(this.table);
    }

}