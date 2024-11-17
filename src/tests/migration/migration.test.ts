/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { App } from '@src/core/services/App';
import TestMigrationModel from '@src/tests/migration/models/TestMigrationModel';
import TestApiTokenModel from '@src/tests/models/models/TestApiTokenModel';
import TestModel from '@src/tests/models/models/TestModel';
import TestUser from '@src/tests/models/models/TestUser';
import testHelper from '@src/tests/testHelper';

const dropAndCreateMigrationSchema = async () => {
    const migrationTable = new TestMigrationModel(null).table

    if(await App.container('db').schema().tableExists(migrationTable)) {
        await App.container('db').schema().dropTable(migrationTable);
    }

    await App.container('db').createMigrationSchema(migrationTable)
}

const dropTestSchema = async () => {
    if(await App.container('db').schema().tableExists('tests')) {
        await App.container('db').schema().dropTable('tests');
    }

}


describe('test migrations', () => {

    let schema: IDatabaseSchema;

    let tables: string[];

    beforeAll(async () => {
        await testHelper.testBootApp()

        tables = [
            (new TestApiTokenModel).table,
            (new TestUser).table,
            (new TestModel(null)).table
        ]

        console.log('Connection', App.container('db').getDefaultConnectionName())

        await dropAndCreateMigrationSchema()

        await dropTestSchema()

        schema = App.container('db').schema();
    });

    afterAll(async () => {
        await App.container('db').schema().dropTable('tests');
        await App.container('db').schema().dropTable('migrations');
    })  

    test('test up migration', async () => {

        await App.container('console').reader(['migrate:up', '--group=testing']).handle();

        for(const table of tables) {
            const tableExists = await schema.tableExists(table);
            console.log('tableExists (expect: true)', table, tableExists)
            expect(tableExists).toBe(true);
        }
    });

    test('test down migration', async () => {

        await App.container('console').reader(['migrate:down', '--group=testing']).handle();

        for(const table of tables) {
            const tableExists = await schema.tableExists(table);
            console.log('tableExists (expect: false)', table, tableExists)
            expect(tableExists).toBe(false);
        }

    });
    
});