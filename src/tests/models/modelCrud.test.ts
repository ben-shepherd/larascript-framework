/* eslint-disable no-undef */
import { describe, expect, test } from '@jest/globals';
import Repository from '@src/core/base/Repository';
import { db } from '@src/core/domains/database/services/Database';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import TestModel from '@src/tests/models/models/TestModel';
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
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        })
    }
}
describe('test model crud', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('CRUD', async () => {
        
        for(const connectionName of connections) {
            logger().console('[Connection]', connectionName)
            await resetTable()

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