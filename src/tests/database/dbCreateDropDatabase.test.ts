/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import { App } from '@src/core/services/App';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import testHelper from '@src/tests/testHelper';

const connections = getTestConnectionNames()

describe('create and drop a database', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()

        for(const connectionName of connections) {
            const schema = App.container('db').schema(connectionName)

            try {
                await schema.dropDatabase(testHelper.testDbName)
            }
            // eslint-disable-next-line no-unused-vars
            catch (err) {}
        }
    })

    test('test creating db', async () => {

        for(const connectionName of connections) {
            const schema = App.container('db').schema(connectionName)
         
            await schema.createDatabase(testHelper.testDbName)

            expect(await schema.databaseExists(testHelper.testDbName)).toBe(true)

            await schema.dropDatabase(testHelper.testDbName)

            expect(await schema.databaseExists(testHelper.testDbName)).toBe(false)
        }
    })
});