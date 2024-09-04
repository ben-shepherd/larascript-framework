import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { App } from "@src/core/services/App";
import { DataTypes } from "sequelize";

export class CreateUsersTableMigration extends BaseMigration {

    databaseProvider = 'postgres';

    async up(): Promise<void> {
        
        // Create our user table
        App.container('db').schema().createTable('users',{
            hashedPassword: DataTypes.STRING,
            roles: DataTypes.JSON,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        });

    }

    async down(): Promise<void> {
        App.container('db').schema().dropTable('users');
    }
}