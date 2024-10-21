/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestMigrationProvider from '@src/tests/migration/providers/TestMigrationProvider';
import TestConsoleProvider from '@src/tests/providers/TestConsoleProvider';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';

describe('test migrations', () => {

    let schema: IDatabaseSchema;

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestConsoleProvider(),
                new TestDatabaseProvider(),
                new TestMigrationProvider(),
            ]
        }, {})

        /**
         * Drop the test table if it exists
         */
        if(await App.container('db').schema().tableExists('tests')) {
            await App.container('db').schema().dropTable('tests');
        }

        schema = App.container('db').schema();
    });

    afterAll(async () => {
        await App.container('db').schema().dropTable('tests');
    })

    test('test up migration', async () => {

        await App.container('console').reader(['migrate:up']).handle();

        const tableExists = await schema.tableExists('tests');

        expect(tableExists).toBe(true);
    });

    test('test down migration', async () => {

        await App.container('console').reader(['migrate:down']).handle();

        const tableExists = await schema.tableExists('tests');

        expect(tableExists).toBe(false);
    });
});