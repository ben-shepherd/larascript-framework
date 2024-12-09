/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryService';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetTable } from './models/TestPeopleModel';

describe('eloquent', () => {
    let query!: IEloquent<TestPeopleModel>;

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()

        query = queryBuilder(TestPeopleModel)
            .orderBy('name', 'asc');

        await query.insert([
            {
                name: 'Alice',
                age: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Bob',
                age: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'John',
                age: 35,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jane',
                age: 45,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    });

    test('test count', async () => {
        
        const results = await query.clone().count();
        expect(results).toBe(4);

        const resultsOver30 = await query.clone()
            .where('age', '>', 30)
            .count();
        expect(resultsOver30).toBe(2);

        const resultsUnder30 = await query.clone()
            .where('age', '<', 30)
            .count();
        expect(resultsUnder30).toBe(1);

        const resultsBetween30And40 = await query.clone()
            .where('age', '>=', 30)
            .where('age', '<=', 40)
            .count();
        expect(resultsBetween30And40).toBe(2);

    })

    test('test avg', async () => {
        
        const results = await query.clone().avg('age');
        expect(results).toBe(33.75);

        const resultsOver30 = await query.clone()
            .where('age', '>', 30)
            .avg('age');
        expect(resultsOver30).toBe(40);

        const resultsUnder30 = await query.clone()
            .where('age', '<', 30)
            .avg('age');
        expect(resultsUnder30).toBe(25);

    })

    test('test sum', async () => {
        
        const results = await query.clone().sum('age');
        expect(results).toBe(135);

        const resultsOver30 = await query.clone()
            .where('age', '>', 30)
            .sum('age');
        expect(resultsOver30).toBe(80);

    })

    test('test min', async () => {
        
        const results = await query.clone().min('age');
        expect(results).toBe(25);

    })

    test('test max', async () => {
        
        const results = await query.clone().max('age');
        expect(results).toBe(45);

    })

});