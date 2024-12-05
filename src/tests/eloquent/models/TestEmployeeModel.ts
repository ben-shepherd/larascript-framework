import Model from "@src/core/base/Model";
import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

import TestDepartmentModel, { ITestDepartmentModelData } from "./TestDepartmentModel";

const tableName = Model.formatTableName('testsEmployees')

export interface ITestEmployeeModelData extends IModelAttributes {
    deptId: string;
    name: string;
    age: number;
    salary: number;
    createdAt: Date;
    updatedAt: Date;
    department?: ITestDepartmentModelData
}

export const resetTableEmployeeModel = async (connections: string[] = testHelper.getTestConnectionNames()) => {
    for(const connectionName of connections) {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            deptId: { type: DataTypes.UUID, allowNull: true },
            name: DataTypes.STRING,
            age: DataTypes.INTEGER,
            salary: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

export default class TestEmployeeModel extends Model<ITestEmployeeModelData> {

    table = tableName
    
    public fields: string[] = [
        'deptId',
        'name',
        'salary',
        'createdAt',
        'updatedAt'
    ];

    department(): BelongsTo {
        return this.belongsTo<TestDepartmentModel>(TestDepartmentModel, { localKey: 'deptId' });
    }

}