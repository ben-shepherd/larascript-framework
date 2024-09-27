import User from "@src/app/models/auth/User";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { DataTypes } from "sequelize";

export class CreateUserModelMigration extends BaseMigration {

    // Specify the database provider if this migration should run on a particular database.
    // Uncomment and set to 'mongodb', 'postgres', or another supported provider.
    // If left commented out, the migration will run only on the default provider.
    // databaseProvider: 'mongodb' | 'postgres' = 'postgres';

    group?: string = 'app:setup';

    table = (new User).table;

    async up(): Promise<void> {
        const stringNullable = {
            type: DataTypes.STRING,
            allowNull: true
        }

        await this.schema.createTable(this.table, {
            email: DataTypes.STRING,
            hashedPassword: DataTypes.STRING,
            groups: DataTypes.JSON,
            roles: DataTypes.JSON,
            firstName: stringNullable,
            lastName: stringNullable,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(this.table);
    }

}