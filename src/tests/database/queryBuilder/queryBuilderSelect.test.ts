/* eslint-disable no-undef */
import { describe } from '@jest/globals';
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

    test('test query model constructor',async () => {
        
        const modelCtor = TestModel.query()
            .getModelCtor()

        expect(new modelCtor(null)).toBeInstanceOf(TestModel);

    });

    test('find by id',async () => {
        
    })

    test('select with ascending order',async () => {
        
        for(const connectionName of connections) {
            const documentManager = App.container('db').documentManager(connectionName).table('tests');

            await documentManager.table(tableName).insertMany([
                {name: 'Alice', age: 30, createdAt: new Date(), updatedAt: new Date()},
                {name: 'Ben', age: 40, createdAt: new Date(), updatedAt: new Date()},
                {name: 'Charlie', age: 50, createdAt: new Date(), updatedAt: new Date()},
            ]);

            const result = await TestModel.query()
                .orderBy('age', Direction.ASC)
                .get();

            const first = result.first()
            expect(first).toBeInstanceOf(TestModel);
            expect(first?.attr('name')).toBe('Alice');

            const second = result.get(1)
            expect(second).toBeInstanceOf(TestModel);
            expect(second?.attr('name')).toBe('Ben');

            const last = result.last();
            expect(last).toBeInstanceOf(TestModel);
            expect(last?.attr('name')).toBe('Charlie');

        }

    });
});