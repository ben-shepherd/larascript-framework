import { App } from "@src/core/services/App";
import { DataTypes } from "sequelize";

import PostgresAdapter from "../../postgres/adapters/PostgresAdapter";

/**
 * Creates the migrations table in Postgres if it does not already exist
 *
 * @returns {Promise<void>}
 */
const createPostgresSchema = async (tableName: string = 'migrations') => {
    const sequelize = App.container('db').getAdapter<PostgresAdapter>().getSequelize();
    const queryInterface = sequelize.getQueryInterface();

    if ((await queryInterface.showAllTables())?.includes(tableName)) {
        return;
    }

    await queryInterface.createTable(tableName, {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: 'VARCHAR',
            allowNull: false
        },
        batch: {
            type: 'INT',
            allowNull: false
        },
        checksum: {
            type: 'VARCHAR',
            allowNull: false
        },
        type: {
            type: 'VARCHAR',
            allowNull: false
        },
        appliedAt: {
            type: 'TIMESTAMPTZ',
            allowNull: false
        }
    })
}

export default createPostgresSchema