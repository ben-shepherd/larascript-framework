import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { DataTypes } from "sequelize";

import ApiToken from "../models/auth/ApiToken";

export class CreateApiTokenMigration extends BaseMigration {

    // Specify the database provider if this migration should run on a particular database.
    // Uncomment and set to 'mongodb', 'postgres', or another supported provider.
    // If left commented out, the migration will run only on the default provider.
    // databaseProvider: 'mongodb' | 'postgres' = 'postgres';

    table = new ApiToken(null).table;

    async up(): Promise<void> {
        await this.schema.createTable(this.table, {
            userId: DataTypes.STRING,
            token: DataTypes.STRING,
            revokedAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(this.table);
    }

}