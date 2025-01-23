import { db } from "@src/core/domains/database/services/Database";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";
import TestObserver from "@src/tests/models/observers/TestObserver";
import { forEveryConnection } from "@src/tests/testHelper";
import { DataTypes } from "sequelize";

export interface TestObserverModelData extends IModelAttributes {
    number: number;
    name: string
}

const tableName = 'test_observer'

export const resetTestObserverTable = async () => {
    await forEveryConnection(async connectionName => {  
        const schema = db().schema(connectionName)

        
        if(await schema.tableExists(tableName)) {
            await schema.dropTable(tableName);
        }

        await schema.createTable(tableName, {
            number: DataTypes.INTEGER,
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })
}

class TestObserverModel extends Model<TestObserverModelData> {

    constructor(data: TestObserverModelData | null = null) {
        super(data);
        this.setObserverConstructor(TestObserver);
        this.setObserveProperty('name', 'onNameChange');
    }

    public table: string = tableName;

    public fields: string[] = [
        'name',
        'number',
        'createdAt',
        'updatedAt'
    ]

}

export default TestObserverModel