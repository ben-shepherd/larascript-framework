/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IDatabaseSchema } from '@src/core/domains/database/interfaces/IDatabaseSchema';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

import { TestModelData } from '../models/models/TestModel';
import TestMigrationModel from './models/TestMigrationModel';

const dropAndCreateMigrationSchema = async () => {
    const migrationTable = new TestMigrationModel(null).table

    if(await App.container('db').schema().tableExists(migrationTable)) {
        await App.container('db').schema().dropTable(migrationTable);
    }

    await App.container('db').createMigrationSchema(migrationTable)
}

const dropAndCreateTestSchema = async () => {
    if(await App.container('db').schema().tableExists('tests')) {
        await App.container('db').schema().dropTable('tests');
    }

    await App.container('db').schema().createTable('tests', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
}

describe('test seeders', () => {

    let schema: IDatabaseSchema;

    beforeAll(async () => {
        await testHelper.testBootApp()

        console.log('Connection: ' + App.container('db').getDefaultConnectionName())

        await dropAndCreateTestSchema()

        await dropAndCreateMigrationSchema()

        schema = App.container('db').schema();
    });

    afterAll(async () => {
        await App.container('db').schema().dropTable('tests');
        await App.container('db').schema().dropTable('migrations');
    })

    test('test up seeder', async () => {

        await App.container('console').reader(['db:seed', '--group=testing']).handle();

        const tableExists = await schema.tableExists('tests');

        expect(tableExists).toBe(true);

        const data1 = await App.container('db').documentManager().table('tests').findOne<TestModelData>({
            filter: {
                name: 'John'
            }
        })

        expect(typeof data1 === 'object').toEqual(true);
        expect(data1?.name).toEqual('John');

        const data2 = await App.container('db').documentManager().table('tests').findOne<TestModelData>({
            filter: {
                name: 'Jane'
            }
        })

        expect(typeof data2 === 'object').toEqual(true);
        expect(data2?.name).toEqual('Jane');

    });

});