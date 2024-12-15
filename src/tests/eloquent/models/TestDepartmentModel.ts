import IModelAttributes from "@src/core/interfaces/IModelData";
import Model from "@src/core/models/base/Model";
import { App } from "@src/core/services/App";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";
import TestEmployeeModel, { ITestEmployeeModelData } from "@src/tests/eloquent/models/TestEmployeeModel";

const tableName = Model.formatTableName('testsDepartments')

export interface ITestDepartmentModelData extends IModelAttributes {
    deptId: string;
    deptName: string;
    createdAt: Date;
    updatedAt: Date;
    employees?: ITestEmployeeModelData[];

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

    async employees(): Promise<TestEmployeeModel[]> {
        return this.hasMany(TestEmployeeModel, { foreignKey: 'deptId', localKey: 'id' });
    }

}