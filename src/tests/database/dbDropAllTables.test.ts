/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { App } from '@src/core/services/App';
import { DataTypes } from 'sequelize';

import testHelper from '../testHelper';

const connections = testHelper.getTestConnectionNames()

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


describe('test dropping all tables', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()

        
        for(const connectionName of connections) {
            await dropTable(connectionName)
            await createTable(connectionName)
        }
    })

    test('create and then drop all tables', async () => {

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