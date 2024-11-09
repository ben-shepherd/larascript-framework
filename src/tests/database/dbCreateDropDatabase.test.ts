/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
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
            const schema = App.container('db').schema(connectionName)
         
            await schema.createDatabase(testHelper.getTestDbName())

            expect(await schema.databaseExists(testHelper.getTestDbName())).toBe(true)

            await schema.dropDatabase(testHelper.getTestDbName())

            expect(await schema.databaseExists(testHelper.getTestDbName())).toBe(false)
        }
    })
});