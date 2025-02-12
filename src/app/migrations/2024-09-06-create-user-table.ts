import User from "@src/app/models/auth/User";
import { authJwt } from "@src/core/domains/auth/services/JwtAuthService";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { DataTypes } from "sequelize";

export class CreateUserModelMigration extends BaseMigration {

    group?: string = 'app:setup';

    async up(): Promise<void> {

        const stringNullable = {
            type: DataTypes.STRING,
            allowNull: true
        }

        await this.schema.createTable(User.getTable(), {

            // Include auth fields (email, hashedPassword, groups, roles)
            ...authJwt().getCreateUserTableSchema(),

            // User fields
            firstName: stringNullable,
            lastName: stringNullable,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE

        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(User.getTable());
    }

}