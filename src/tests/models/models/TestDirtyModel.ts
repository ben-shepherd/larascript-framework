import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";
import { App } from "@src/core/services/App";
import { forEveryConnection } from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

interface TestDirtyModelAttributes extends IModelAttributes {
    name: string,
    array: string[],
    object: object
}

export const resetDirtyTable = async () => {
    const tableName = TestDirtyModel.getTable()

    await forEveryConnection(async connectionName => {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            name: DataTypes.STRING,
            array: DataTypes.ARRAY(DataTypes.STRING),
            object: DataTypes.JSON,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })
}

class TestDirtyModel extends Model<TestDirtyModelAttributes> {

    public table: string = 'tests';

    public fields: string[] = [
        'name',
        'array',
        'object',
        'createdAt',
        'updatedAt'
    ]

    public json: string[] = ['object']

}

export default TestDirtyModel