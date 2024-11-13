import { beforeAll, describe, test } from '@jest/globals';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

const connections = testHelper.getTestConnectionNames()

describe('end test', () => {

    beforeAll(async () => {
        await testHelper.testBootApp();
    })

    test('drop test db', async () => {

        for(const connectionName of connections) {
            const schema = App.container('db').schema(connectionName)

            await schema.dropDatabase(testHelper.getTestDbName());
        }
        
    })
});