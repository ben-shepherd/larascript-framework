import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from './config/testConfig';
import { getTestConnectionNames } from './config/testDatabaseConfig';
import { TestAuthorModel } from './models/models/TestAuthor';
import TestModel from './models/models/TestModel';
import { TestMovieModel } from './models/models/TestMovie';
import TestWorkerModel from './models/models/TestWorkerModel';
import TestDatabaseProvider from './providers/TestDatabaseProvider';

describe('clean up tables', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new TestDatabaseProvider()
            ]
        }, {})
    })

    test('drop tables', async () => {

        const tables = [
            (new TestMovieModel(null)).table,
            (new TestAuthorModel(null)).table,
            (new TestWorkerModel(null)).table,
            (new TestModel(null)).table,
        ].filter((value, index, self) => self.indexOf(value) === index);

        for (const connectionName of getTestConnectionNames()) {

            const schema = App.container('db').schema(connectionName);

            for (const table of tables) {
                if (await schema.tableExists(table)) {
                    await schema.dropTable(table);
                }

                expect(await schema.tableExists(table)).toBeFalsy();
            }
        }
    })
});