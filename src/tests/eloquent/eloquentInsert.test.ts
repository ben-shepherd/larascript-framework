/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestPeopleModel, { resetPeopleTable } from '@src/tests/eloquent/models/TestPeopleModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetPeopleTable()
    });

    test('test insert records', async () => {
        await forEveryConnection(async connection => {
            const results = await queryBuilder(TestPeopleModel, connection)
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
        })

    });
});