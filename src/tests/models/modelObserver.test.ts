/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Kernel from '@src/core/Kernel';
import { App } from '@src/core/services/App';
import testAppConfig from '@src/tests/config/testConfig';
import { getTestConnectionNames } from '@src/tests/config/testDatabaseConfig';
import TestDatabaseProvider from '@src/tests/providers/TestDatabaseProvider';
import { DataTypes } from 'sequelize';

import TestObserverModel from '@src/tests/models/models/TestObserverModel';

const connections = getTestConnectionNames()

const createTable = async (connectionName: string) => {
    const schema = App.container('db').schema(connectionName)

    schema.createTable('tests', {
        number: DataTypes.INTEGER,
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
             * 
             * The 'TestModelObserver' will modify the following attributes:
             * - On creating, it will set  'number' to 1
             * = On setting the name, it will set the name to 'Bob'
             */ 
            const createdModel = new TestObserverModel({
                name: 'John',
                number: 0
            });
            await createdModel.save();
            expect(createdModel.getAttribute('name')).toEqual('John');
            expect(createdModel.getAttribute('number')).toEqual(1);

            await createdModel.setAttribute('name', 'Jane');
            expect(createdModel.getAttribute('name')).toEqual('Bob');


        }

    
    })
});