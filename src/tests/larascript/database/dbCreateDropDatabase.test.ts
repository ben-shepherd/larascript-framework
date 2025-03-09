/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import testHelper from '@src/tests/testHelper';

const connections = testHelper.getTestConnectionNames()
const db_name = 'test_create_drop_db';

/**
 * Resets databases for all connections by dropping the test database.
 * Used as a beforeAll hook in database-related tests.
 */
const resetDatabases = async () => {
    for(const connectionName of connections) {

        try {
            if(await db().schema(connectionName).databaseExists(db_name)) {
                await db().schema(connectionName).dropDatabase(db_name)
            }
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) {}
    }
}

describe('create and drop a database', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetDatabases()
    })

    afterAll(async () => {
        for(const connectionName of connections) {
            await db().schema(connectionName).dropDatabase(db_name)
        }
    })

    test('test creating db, then dropping', async () => {
        for(const connectionName of connections) {
            console.log('Connection', connectionName, testHelper.getTestDbName())
            const schema = db().schema(connectionName)


            await schema.createDatabase(db_name)
            const exists = await schema.databaseExists(db_name)
            expect(exists).toBe(true)

            await schema.dropDatabase(db_name)
            expect(await schema.databaseExists(db_name)).toBe(false)
        }
    })
});