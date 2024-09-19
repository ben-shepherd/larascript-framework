import BaseDatabaseSchema from "@src/core/domains/database/base/BaseDatabaseSchema";
import { IAlterTableOptions } from "@src/core/domains/database/interfaces/postgres/IPostgresAlterTableOptions";
import Postgres from "@src/core/domains/database/providers-db/Postgres";
import { DataTypes, QueryInterfaceCreateTableOptions, QueryInterfaceDropTableOptions } from "sequelize";
import { ModelAttributes } from 'sequelize/types/model';

class PostgresSchema extends BaseDatabaseSchema<Postgres> {

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
     * @param tableName 
     * @param attributes 
     * @param optons 
     */
    async createTable(tableName: string, attributes: ModelAttributes, optons?: QueryInterfaceCreateTableOptions): Promise<void> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.createTable(tableName, this.withIdSchema(attributes), optons);
    }

    /**
     * Drop a table
     * @param tableName 
     * @param options 
     */
    async dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): Promise<void> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        await queryInterface.dropTable(tableName, options);
    }

    /**
     * Alters a table
     * @param tableName 
     * @param options 
     */
    async alterTable(tableName: IAlterTableOptions['tableName'], options: Omit<IAlterTableOptions, 'tableName'>): Promise<void> {
        const sequelize = this.driver.getClient();
    
        if(options.addColumn) {
            await sequelize.getQueryInterface().addColumn(
                tableName,
                options.addColumn.key,
                options.addColumn.attribute,
                options.addColumn.options
            );
        }
        if(options.removeColumn) {
            await sequelize.getQueryInterface().removeColumn(
                tableName,
                options.removeColumn.attribute,
                options.removeColumn.options
            )
        }
        if(options.changeColumn) {
            await sequelize.getQueryInterface().changeColumn(
                tableName,
                options.changeColumn.attributeName,
                options.changeColumn.dataTypeOrOptions,
                options.changeColumn.options
            );
        }
        if(options.renameColumn) {
            await sequelize.getQueryInterface().renameColumn(
                tableName,
                options.renameColumn.attrNameBefore,
                options.renameColumn.attrNameAfter,
                options.renameColumn.options
            );
        }
        if(options.addIndex) {
            await sequelize.getQueryInterface().addIndex(
                tableName,
                options.addIndex.attributes,
                options.addIndex.options
            );
        }
        if(options.removeIndex) {
            await sequelize.getQueryInterface().removeIndex(
                tableName,
                options.removeIndex.indexName,
                options.removeIndex.options
            );
        }
    }

    /**
     * Check if table exists
     * @param tableName 
     * @returns 
     */
    async tableExists(tableName: string): Promise<boolean> {
        const sequelize = this.driver.getClient();
        const queryInterface = sequelize.getQueryInterface();
        return await queryInterface.tableExists(tableName);
    }

}

export default PostgresSchema