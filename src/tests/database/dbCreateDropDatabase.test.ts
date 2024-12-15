/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

const connections = testHelper.getTestConnectionNames()

describe('create and drop a database', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()

        for(const connectionName of connections) {
            const schema = App.container('db').schema(connectionName)

            try {
                await schema.dropDatabase(testHelper.getTestDbName())
            }
            // eslint-disable-next-line no-unused-vars
            catch (err) {}
        }
    })

    test('test creating db', async () => {

        for(const connectionName of connections) {
            console.log('Connection', connectionName, testHelper.getTestDbName())

            const schema = App.container('db').schema(connectionName)

            if(connectionName === 'postgres') {
                const sequelize = db().getAdapter<PostgresAdapter>().getSequelize()
                
                await Promise.all([
                    sequelize.close(),
                    sequelize.connectionManager.close()
                ]);
            }
         
            await schema.createDatabase(testHelper.getTestDbName())

            const exists = await schema.databaseExists(testHelper.getTestDbName())
            expect(exists).toBe(true)

            await schema.dropDatabase(testHelper.getTestDbName())

            expect(await schema.databaseExists(testHelper.getTestDbName())).toBe(false)
        }
    })
});