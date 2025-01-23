import BelongsTo from "@src/core/domains/eloquent/relational/BelongsTo";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";
import { App } from "@src/core/services/App";
import TestDepartmentModel from "@src/tests/eloquent/models/TestDepartmentModel";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

const tableName = Model.formatTableName('testsEmployees')

export interface ITestEmployeeModelData extends IModelAttributes {
    id: string;
    name: string;
    type: string;
    issuedAt: Date;
    createdAt: Date;
    updatedAt: Date
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

export default class TestPhysicalAssetModel extends Model<ITestEmployeeModelData> {

    table = tableName
    
    public fields: string[] = [
        'deptId',
        'name',
        'salary',
        'createdAt',
        'updatedAt'
    ];

    relationships = [
        'department'
    ]

    department(): BelongsTo {
        return this.belongsTo<TestDepartmentModel>(TestDepartmentModel, { localKey: 'deptId' });
    }

}