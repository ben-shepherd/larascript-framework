/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { ITestPeopleModelData, resetTable } from './models/TestPeopleModel';

describe('eloquent', () => {

    let query!: IEloquent<ITestPeopleModelData>;

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()
        query = TestPeopleModel.query();
    });

    test('test updating records', async () => {

        const results = await query.insert([
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


        const updatedFirst = await query.clone().where('name', 'John').update({ age: 26 });
        expect(updatedFirst.count()).toBe(1);
        expect(updatedFirst[0].id).toBe(results[0].id);
        expect(updatedFirst[0].age).toBe(26);

        const updatedSecond = await query.clone().where('name', 'Jane').update({ age: 31 });
        expect(updatedSecond.count()).toBe(1);
        expect(updatedSecond[0].id).toBe(results[1].id);
        expect(updatedSecond[0].age).toBe(31);

        const updatedBoth = await query.clone().updateAll({ age: 27 });
        expect(updatedBoth.count()).toBe(2);
        expect(updatedBoth[0].id).toBe(results[0].id);
        expect(updatedBoth[0].age).toBe(27);
        expect(updatedBoth[1].id).toBe(results[1].id);
        expect(updatedBoth[1].age).toBe(27);

    });
});