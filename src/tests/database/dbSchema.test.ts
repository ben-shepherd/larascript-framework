 
import { beforeAll, describe, expect, test } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import Model from '@src/core/domains/models/base/Model';
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";
import PostgresSchema from '@src/core/domains/postgres/PostgresSchema';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';


const connections = testHelper.getTestConnectionNames()

interface TestSchemaModelAttributes extends IModelAttributes { name: string, age?: number };

class TestSchemaModel extends Model<TestSchemaModelAttributes> {

    public table: string = 'tests'

    public fields: string[] = ['name', 'age']

}

const resetTable = async () => {
    for(const connectionName of testHelper.getTestConnectionNames()) {
        try {
            const schema = db().schema(connectionName);
            await schema.dropTable(tableName);
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {}

        const schema = db().schema(connectionName);
        await schema.createTable(tableName, {
            name: DataTypes.STRING,
        });
    }
}

let tableName!: string;

describe('db schema', () => {

    beforeAll(async () => {
        await testHelper.testBootApp();

        tableName = TestSchemaModel.getTable()
    });

    test('insert test data', async () => {

        await resetTable()
        
        for(const connectionName of connections) {

            const insertedDocument = (
                await queryBuilder(TestSchemaModel, connectionName).insert({
                    name: 'test'
                })
            )?.[0];

            expect(typeof insertedDocument?.id === 'string').toBe(true);
            expect(insertedDocument?.name).toBe('test');

        }
    })

    test('insert test data with altered column', async () => {

        await resetTable()
        
        for(const connectionName of connections) {
            const schema = db().schema(connectionName);

            if(connectionName === 'mongodb') {
                continue;
            }
            
            await schema.alterTable(tableName, {
                addColumn: {
                    key: 'age',
                    attribute: DataTypes.INTEGER
                }
            });

            await queryBuilder(TestSchemaModel, connectionName).insert({
                name: 'test',
                age: 20
            })

            const foundDocument = await queryBuilder(TestSchemaModel, connectionName).where('name', 'test').first();
            expect(typeof foundDocument?.id === 'string').toBe(true);
            expect(foundDocument?.name).toBe('test');
            expect(foundDocument?.age).toBe(20);

        }
    })

    test('remove column', async () => {
        await resetTable()

        for(const connectionName of connections) {
            const schema = App.container('db').schema<PostgresSchema>(connectionName);

            if(connectionName === 'mongodb') {
                continue;
            }
            
            await schema.alterTable(tableName, {
                addColumn: {
                    key: 'age',
                    attribute: DataTypes.INTEGER
                }
            });

            await queryBuilder(TestSchemaModel, connectionName).insert({
                name: 'test',
                age: 20
            })
            
            await schema.alterTable(tableName, {
                removeColumn: {
                    attribute: 'age'
                }
            });

            const foundDocument = await queryBuilder(TestSchemaModel, connectionName).select(['id', 'name']).where('name', 'test').firstOrFail();

            expect(foundDocument?.id).toBeTruthy();
            expect(foundDocument?.name).toBe('test');
            expect(foundDocument?.age).toBeFalsy();
        }
    })
});