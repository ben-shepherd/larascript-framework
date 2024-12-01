/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { ITestPeopleModelData, resetTable } from './models/TestPeopleModel';

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()
    });

    test('test clone query', async () => {
        const query = TestPeopleModel.query<ITestPeopleModelData>();

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
        ]);

        const restrictedResult = await query.clone().where('age', '=', 25).first()
        expect(restrictedResult?.id).toBe(inserted[0].id);
        expect(restrictedResult?.name).toBe('John');

        const everythingResult = await query.clone().get()
        expect(everythingResult.count()).toBe(2);
        expect(everythingResult[0].id).toBe(inserted[0].id);
        expect(everythingResult[0].name).toBe('John');
        expect(everythingResult[1].id).toBe(inserted[1].id);
        expect(everythingResult[1].name).toBe('Jane');
        

    });
});