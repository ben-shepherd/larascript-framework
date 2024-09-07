import DatabaseSchema from "@src/core/domains/database/base/DatabaseSchema";
import Postgres from "@src/core/domains/database/providers-db/Postgres";
import { DataTypes, QueryInterfaceCreateTableOptions, QueryInterfaceDropTableOptions } from "sequelize";
import { ModelAttributes } from 'sequelize/types/model';

class PostgresSchema extends DatabaseSchema<Postgres> {

    /**
     * Ensure id property is added to attributes
     * @param attributes 
     * @returns 
     */
    protected withIdSchema(attributes: ModelAttributes): ModelAttributes {
        if(attributes['id'] === undefined) {
            return {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                },
                ...attributes,
            }
        }

        return attributes
    }

    /**
     * Create a table (id property is optional and is automatically added if not present)
     * @param name 
     * @param attributes 
     * @param optons 
     */
    async createTable(name: string, attributes: ModelAttributes, optons?: QueryInterfaceCreateTableOptions): Promise<void> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.createTable(name, this.withIdSchema(attributes), optons);
    }

    /**
     * Drop a table
     * @param name 
     * @param options 
     */
    async dropTable(name: string, options?: QueryInterfaceDropTableOptions): Promise<void> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        queryInterface.dropTable(name, options);
    }

    /**
     * Check if table exists
     * @param name 
     * @returns 
     */
    async tableExists(name: string): Promise<boolean> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        return await queryInterface.tableExists(name);
    }

}

export default PostgresSchema