/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { app } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetTable } from './models/TestPeopleModel';

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()
    });

    test('test clone query', async () => {
        const query = app('query').builder(TestPeopleModel);

        const inserted = await query.clone().insert([
            {
                name: 'John',
                age: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jane',
                age: 30,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])

        const restrictedQuery = query.clone().where('age', '=', 25);
        const restrictedResult = await restrictedQuery.first()
        expect(restrictedResult?.id).toBe(inserted[0].id);
        expect(restrictedResult?.name).toBe('John');

        console.log('restricted expression', restrictedQuery.getExpression());

        const everythingQuery = query.clone();
        const everythingResult = await everythingQuery.get()

        console.log('everything expression', everythingQuery.getExpression());

        expect(everythingResult.count()).toBe(2);
        expect(everythingResult?.[0]?.id).toBe(inserted[0].id);
        expect(everythingResult?.[0]?.name).toBe('John');
        expect(everythingResult?.[1]?.id).toBe(inserted[1].id);
        expect(everythingResult?.[1]?.name).toBe('Jane');
        

    });
});