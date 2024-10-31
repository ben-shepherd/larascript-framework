/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import Repository from '@src/core/base/Repository';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import TestModel from '@src/tests/models/models/TestModel';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

const connections = getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        name: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    })
}

const dropTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    if(await schema.tableExists('tests')) {
        await schema.dropTable('tests');
    }
}


describe('test model crud', () => {

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
                new TestDatabaseProvider()
            ]
        }, {})

        
        for(const connectionName of connections) {
            await dropTable(connectionName)
            await createTable(connectionName)
        }
    })

    test('CRUD', async () => {
        
        for(const connectionName of connections) {
            App.container('logger').info('[Connection]', connectionName)
            App.container('db').setDefaultConnectionName(connectionName);

            const documentManager = App.container('db').documentManager(connectionName).table('tests');
            await documentManager.truncate();

            /**
             * Create a model
             */
            const createdModel = new TestModel({
                name: 'John'
            });
            expect(createdModel.getAttribute('name')).toEqual('John');
            
            await createdModel.save();
            expect(typeof createdModel.getId() === 'string').toBe(true);
    
            /**
             * Change name attribute
             */
            await createdModel.setAttribute('name', 'Jane');
            await createdModel.update();
            await createdModel.refresh();
            expect(typeof createdModel.getId() === 'string').toBe(true);
            expect(createdModel.getAttribute('name')).toEqual('Jane');
    

            /**
             * Query with repository
             */
            const repository = new Repository(TestModel);
            const fetchedModel = await repository.findOne({
                name: 'Jane'   
            })
            expect(fetchedModel).toBeTruthy()
            expect(fetchedModel?.getId() === createdModel.getId()).toBe(true)
            expect(fetchedModel?.getAttribute('name')).toEqual('Jane');

            /**
             * Delete the model
             */
            await createdModel.delete();
            expect(createdModel.getId()).toBeFalsy();
            expect(await createdModel.getData()).toBeFalsy();
        }

    
    })
});