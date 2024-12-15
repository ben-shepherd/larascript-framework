/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import { db } from '@src/core/domains/database/services/Database';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import TestObserverModel from '@src/tests/models/models/TestObserverModel';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

const connections = testHelper.getTestConnectionNames()

const resetTable = async () => {
    for(const connectionName of connections) {
        const schema = db().schema(connectionName)

        
        if(await schema.tableExists('tests')) {
            await schema.dropTable('tests');
        }

        schema.createTable('tests', {
            number: DataTypes.INTEGER,
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}

describe('test model observer', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('CRUD', async () => {
        
        for(const connectionName of connections) {
            logger().console('[Connection]', connectionName)

            await resetTable();
        
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
            expect(createdModel.getAttributeSync('name')).toEqual('John');
            expect(createdModel.getAttributeSync('number')).toEqual(1);

            await createdModel.setAttribute('name', 'Jane');
            expect(createdModel.getAttributeSync('name')).toEqual('Bob');


        }

    
    })
});