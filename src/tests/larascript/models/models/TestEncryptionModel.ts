import Model from "@src/core/domains/models/base/Model";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";
import { App } from "@src/core/services/App";
import { forEveryConnection } from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

export interface TestEncryptionModelAttributes extends IModelAttributes {
    id: string
    secret: string | null
    createdAt: Date
    updatedAt: Date
}

export const resetEncryptionTable = async () => {
    const tableName = TestEncryptionModel.getTable()

    await forEveryConnection(async connectionName => {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            secret: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })
}

class TestEncryptionModel extends Model<TestEncryptionModelAttributes> {

    public table: string = 'testsEncryption';

    public fields: string[] = [
        'secret',
        'createdAt',
        'updatedAt'
    ]

    public encrypted: string[] = ['secret']

}

export default TestEncryptionModel