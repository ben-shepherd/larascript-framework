/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { AppSingleton } from '@src/core/services/App';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const createTable = async (connectionName: string) => {
    const schema = AppSingleton.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

const dropTable = async (connectionName: string) => {
    const schema = AppSingleton.container('db').schema(connectionName)

    if (await schema.tableExists('tests')) {
        await schema.dropTable('tests');
    }
}


describe('test dropping all tables', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()

        await forEveryConnection(async connectionName => {
            await dropTable(connectionName)
            await createTable(connectionName)
        })
    })

    test('create and then drop all tables', async () => {

        await forEveryConnection(async connectionName => {
            if (connectionName !== 'mongodb') return;

            const schema = AppSingleton.container('db').schema(connectionName)

            await createTable(connectionName);

            const tableExists = await schema.tableExists('tests');
            expect(tableExists).toBe(true);

            await schema.dropAllTables()

            const tableExistsPostDropAllTables = await schema.tableExists('tests');
            expect(tableExistsPostDropAllTables).toBe(false);
        })
    })
});