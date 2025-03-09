import Collection from "@src/core/domains/collections/Collection";
import HasMany from "@src/core/domains/eloquent/relational/HasMany";
import Model from "@src/core/domains/models/base/Model";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";
import { App } from "@src/core/services/App";
import TestEmployeeModel from "@src/tests/larascript/eloquent/models/TestEmployeeModel";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

const tableName = Model.formatTableName('testsDepartments')

export interface ITestDepartmentModelData extends IModelAttributes {
    deptId: string;
    deptName: string;
    createdAt: Date;
    updatedAt: Date;
    employees?: Collection<TestEmployeeModel>;

}

export const resetTableDepartmentModel = async (connections: string[] = testHelper.getTestConnectionNames()) => {
    for(const connectionName of connections) {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            deptName: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

export default class TestDepartmentModel extends Model<ITestDepartmentModelData> {

    table = tableName
    
    public fields: string[] = [
        'deptName',
        'createdAt',
        'updatedAt'
    ];

    employees(): HasMany {
        return this.hasMany(TestEmployeeModel, { foreignKey: 'deptId', localKey: 'id' });
    }

}