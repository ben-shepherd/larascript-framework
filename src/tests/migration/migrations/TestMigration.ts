import PostgresSchema from "@src/core/domains/database/schema/PostgresSchema";
import BaseMigration from "@src/core/domains/migrations/base/BaseMigration";
import { App } from "@src/core/services/App";
import { DataTypes } from "sequelize";

class TestMigration extends BaseMigration {

    async up(): Promise<void> {
        await App.container('db').schema<PostgresSchema>().createTable('tests', {
            name: DataTypes.STRING,
            age: DataTypes.INTEGER
        })
    }

    async down(): Promise<void> {
        await App.container('db').schema<PostgresSchema>().dropTable('tests')
    }

}

export default TestMigration