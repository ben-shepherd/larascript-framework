import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";
import { App } from "@src/core/services/App";
import { forEveryConnection } from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

const tableName = Model.formatTableName('testsEmails')

export interface ITestEmailModelData extends IModelAttributes {
    email: string;
    createdAt: Date;
    updatedAt: Date;

}

export const resetEmailTable = async () => {
    await forEveryConnection(async connectionName => {
        const schema = App.container('db').schema(connectionName);

        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            email: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })
}

export default class TestEmailModel extends Model<ITestEmailModelData> {

    table = tableName
    
    public fields: string[] = [
        'email',
        'createdAt',
        'updatedAt'
    ];

}