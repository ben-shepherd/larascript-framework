/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

const connections = getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

const dropTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    if(await schema.tableExists('tests')) {
        await schema.dropTable('tests');
    }
}


describe('test partial search', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestDatabaseProvider()
            ]
        }, {})

        
        for(const connectionName of connections) {
            await dropTable(connectionName)
            await createTable(connectionName)
        }
    })

    test('test clearing schema', async () => {

        for(const connectionName of connections) {
            const schema = App.container('db').schema(connectionName)

            await createTable(connectionName);

            const tableExists = await schema.tableExists('tests');
            expect(tableExists).toBe(true);

            await schema.dropAllTables()

            const tableExistsPostDropAllTables = await schema.tableExists('tests');
            expect(tableExistsPostDropAllTables).toBe(false);
        }
    })
});