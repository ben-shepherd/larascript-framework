/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import BaseQueryBuilder from '@src/core/domains/eloquent/base/BaseQueryBuilder';
import Direction from '@src/core/domains/eloquent/enums/Direction';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { DataTypes } from 'sequelize';

import TestQueryBuilderModel from './TestQueryBuilderModel';

/**
 * TODO: UNCOMMENT THIS LINE WHEN THE TESTS ARE READY
 */
// const connections = testHelper.getTestConnectionNames()
const connections = ['postgres']
const TestModel = TestQueryBuilderModel

describe('query builder select', () => {

    let tableName!: string;

    /**
   * Boot the MongoDB provider
   */
    beforeAll(async () => {
        await testHelper.testBootApp()
        await testHelper.clearMigrations();
        
        tableName = new TestModel(null).table
        
        for(const connectionName of connections) {
            await App.container('db').schema(connectionName).createTable(tableName, {
                name: DataTypes.STRING,
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE    
            })
        }
    })

    /**
   * Test the MongoDB connection
   */
    test('test with ascending order',async () => {
        
        for(const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table('tests');

            await documentManager.table(tableName).insertMany([
                {name: 'Bob', age: 30, createdAt: new Date(), updatedAt: new Date()},
                {name: 'John', age: 40, createdAt: new Date(), updatedAt: new Date()},
                {name: 'Alice', age: 50, createdAt: new Date(), updatedAt: new Date()},
            ]);

            const query = TestModel.query()
                .orderBy('age', Direction.ASC);

            expect(query instanceof BaseQueryBuilder).toBe(true);

            const result = await query.get()

            expect(result.count()).toBe(3);

            expect(result[0].name).toBe('Bob');

            /**
             * TODO: finish test
             */
        }

    });
});