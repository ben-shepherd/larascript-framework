import Model from "@src/core/base/Model";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

const tableName = Model.formatTableName('testsPeople')

export interface ITestPeopleModelData extends IModelAttributes {
    id: string,
    name: string;
    age: number;
    born?: Date,
    createdAt: Date;
    updatedAt: Date;

}

export const resetTable = async (connections: string[] = testHelper.getTestConnectionNames()) => {
    for(const connectionName of connections) {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            name: DataTypes.STRING,
            age: DataTypes.INTEGER,
            born: DataTypes.DATE,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

export default class TestPeopleModel extends Model<ITestPeopleModelData> {

    table = tableName
    
    public fields: string[] = [
        'name',
        'age',
        'createdAt',
        'updatedAt'
    ];

}