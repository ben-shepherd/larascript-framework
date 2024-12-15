/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import { App } from '@src/core/services/App';
import TestModel from '@src/tests/models/models/TestModel';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const connections = testHelper.getTestConnectionNames()

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
        await testHelper.testBootApp()
        
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
            expect(createdModel.getAttributeSync('name')).toEqual('John');
            
            await createdModel.save();
            expect(typeof createdModel.getId() === 'string').toBe(true);
    
            /**
             * Change name attribute
             */
            await createdModel.setAttribute('name', 'Jane');
            await createdModel.update();
            await createdModel.refresh();
            expect(typeof createdModel.getId() === 'string').toBe(true);
            expect(createdModel.getAttributeSync('name')).toEqual('Jane');
    

            /**
             * Query with repository
             */
            const repository = new Repository(TestModel);
            const fetchedModel = await repository.findOne({
                name: 'Jane'   
            })
            expect(fetchedModel).toBeTruthy()
            expect(fetchedModel?.getId() === createdModel.getId()).toBe(true)
            expect(fetchedModel?.getAttributeSync('name')).toEqual('Jane');

            /**
             * Delete the model
             */
            await createdModel.delete();
            expect(createdModel.getId()).toBeFalsy();
            expect(await createdModel.toObject()).toBeFalsy();
        }

    
    })
});