 
import { beforeAll, describe, expect, test } from '@jest/globals';
import PostgresSchema from '@src/core/domains/database/schema/PostgresSchema';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

import testHelper from '../testHelper';

const connections = testHelper.getTestConnectionNames()

const tableName = 'testTable';
type Data = { id?: string, name: string, age?: number };

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName);
    await schema.createTable(tableName, {
        name: DataTypes.STRING,
    });
};

const dropTable = async (connectionName: string) => {
    try {
        const schema = App.container('db').schema(connectionName);
        await schema.dropTable(tableName);
    }
    // eslint-disable-next-line no-unused-vars
    catch (err) {}
};

describe('Combined DocumentManager Interface Test', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestDatabaseProvider()
            ]
        }, {});

        for (const connectionName of connections) {
            await dropTable(connectionName);
            await createTable(connectionName);
        }
    });

    test('insert test data', async () => {
        
        for(const connectionName of connections) {
            const documentManager = App.container('db')
                .documentManager(connectionName)
                .table(tableName);

            const data: Data = {
                name: 'test'
            }

            const insertedDocument = await documentManager.insertOne<Data>(data);
            expect(typeof insertedDocument?.id === 'string').toBe(true);
            expect(insertedDocument?.name).toBe('test');

        }
    })

    test('alter table', async () => {
        for(const connectionName of connections) {
            const schema = App.container('db').schema<PostgresSchema>(connectionName);

            if(connectionName === 'mongodb') {
                App.container('logger').console('Ignoring MongoDB alter table test');
                continue;
            }
            
            await schema.alterTable(tableName, {
                addColumn: {
                    key: 'age',
                    attribute: DataTypes.INTEGER
                }
            });

            expect(true).toBeTruthy();
        }
    });

    test('insert test data with altered column', async () => {
        
        for(const connectionName of connections) {
            const documentManager = App.container('db')
                .documentManager(connectionName)
                .table(tableName);

            const data: Data = {
                name: 'test',
                age: 20
            }

            const insertedDocument = await documentManager.insertOne<Data>(data);
            expect(typeof insertedDocument?.id === 'string').toBe(true);
            expect(insertedDocument?.name).toBe('test');
            expect(insertedDocument?.age).toBe(20);

            const foundDocument = await documentManager.findOne<Data>({ 
                filter: {
                    id: insertedDocument?.id
                }
            });
            expect(typeof foundDocument?.id === 'string').toBe(true);
            expect(foundDocument?.name).toBe('test');
            expect(foundDocument?.age).toBe(20);

        }
    })

    test('remove column', async () => {
        for(const connectionName of connections) {
            const schema = App.container('db').schema<PostgresSchema>(connectionName);
            
            await schema.alterTable(tableName, {
                removeColumn: {
                    attribute: 'age'
                }
            });

            const documentManager = App.container('db')
                .documentManager(connectionName)
                .table(tableName);

            const foundDocument = await documentManager.findOne<Data>({});
            expect(typeof foundDocument?.id === 'string').toBe(true);
            expect(foundDocument?.name).toBe('test');
            expect(foundDocument?.age).toBeFalsy();
        }
    })
});