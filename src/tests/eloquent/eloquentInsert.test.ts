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

    test('test insert records', async () => {
        const results = await app('query').builder(TestPeopleModel)
            .insert([
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
            ]);

        expect(results.count()).toBe(2);

        expect(typeof results.get(0)?.id === 'string').toBeTruthy()
        expect(results.get(0)?.name).toBe('John')
        expect(results.get(0)?.age).toBe(25)

        expect(typeof results.get(1)?.id === 'string').toBeTruthy()
        expect(results.get(1)?.name).toBe('Jane')
        expect(results.get(1)?.age).toBe(30)
        

    });
});