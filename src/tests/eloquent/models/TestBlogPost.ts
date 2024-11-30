import Model from "@src/core/base/Model";
import IModelAttributes from "@src/core/interfaces/IModelData";
import { App } from "@src/core/services/App";
import testHelper from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

const tableName = 'testsBlogPosts'

export interface ITestsBlogPostsData extends IModelAttributes {
    id: string,
    title: string;
    rating: number;
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
            title: DataTypes.STRING,
            rating: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

export default class TestBlogPost extends Model<ITestsBlogPostsData> {

    table = tableName
    
    public fields: string[] = [
        'name',
        'age',
        'createdAt',
        'updatedAt'
    ];

}