/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import Collection from '@src/core/domains/collections/Collection';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetTable } from './models/TestPeopleModel';

describe('eloquent', () => {

    let query!: IEloquent<TestPeopleModel>;
    let inserted!: Collection<TestPeopleModel>;

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()
        
        query = app('query').builder(TestPeopleModel);

        inserted = await query.clone().insert([
            {
                name: 'John',
                age: 20,
                religion: 'Islam',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jane',
                age: 20,
                religion: 'Christian',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Bob',
                age: 30,
                religion: 'Islam',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Alice',
                age: 30,
                religion: 'Jewish',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

    });


    test('test group by', async () => {
        
        const results = await query.clone().groupBy('name').get();
        expect(results.count()).toBe(4);
        expect(results[0].name).toBe('Alice');
        expect(results[1].name).toBe('Bob');
        expect(results[2].name).toBe('Jane');
        expect(results[3].name).toBe('John');

        const resultChristians = await query.clone()
            .where('religion', 'Christian')
            .groupBy('name')
            .get();
        expect(resultChristians.count()).toBe(1);
        expect(resultChristians[0].name).toBe('Jane');

        const resultMuslims = await query.clone()
            .where('religion', 'Islam')
            .groupBy('name')
            .get();
        expect(resultMuslims.count()).toBe(2);
        expect(resultMuslims[0].name).toBe('Bob');
        expect(resultMuslims[1].name).toBe('John');

        const resultJews = await query.clone()
            .where('religion', 'Jewish')
            .groupBy('name')
            .get();
        expect(resultJews.count()).toBe(1);
        expect(resultJews[0].name).toBe('Alice');
    
    })
});