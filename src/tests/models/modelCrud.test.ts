import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import Repository from '@src/core/base/Repository';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import PostgresSchema from '@src/core/domains/database/schema/PostgresSchema';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import TestModel from '@src/tests/models/models/TestModel';
import { DataTypes } from 'sequelize';
import testModelsHelper from '@src/tests/models/testModelsHelper';

describe('test model crud operations', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                new DatabaseProvider()
            ]
        }, {})

        await App.container('db').schema<PostgresSchema>().createTable('tests', {
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    })

    afterAll(async () => {
        await testModelsHelper.cleanupCollections();
    })

    let modelInstance: TestModel;

    test('create test model', async () => {
        modelInstance = new TestModel({
            name: 'nameValue'
        });
        expect(modelInstance.getAttribute('name')).toEqual('nameValue');

        await modelInstance.save();
        expect(modelInstance.getId()).toBeTruthy();
    })

    test('test changing attribute value', async () => {
        modelInstance.setAttribute('name', 'differentNameValue');
        await modelInstance.update();
        await modelInstance.refresh();
        
        expect(modelInstance.getAttribute('name')).toEqual('differentNameValue');
    })

    test('re-query created record', async () => {
        const testDocument = await App.container('db').documentManager().table((new TestModel(null)).table).findOne({
            filter: {
                name: 'differentNameValue'
            }
        }) as TestModel;

        expect(testDocument?.['name']).toEqual('differentNameValue');
    
    })

    test('re-query with repository', async () => {
        const repository = new Repository(new TestModel(null).table, TestModel);
        const modelInstance = await repository.findOne({
            name: 'differentNameValue'   
        })
        
        expect(modelInstance?.getAttribute('name')).toEqual('differentNameValue');
    
    })
});