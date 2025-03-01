/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestPeopleModel, { resetPeopleTable } from '@src/tests/larascript/eloquent/models/TestPeopleModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';
const date2024 = new Date('2024-01-01');
const date2025 = new Date('2025-01-01');

const resetAndRepopulate = async () => {
    await resetPeopleTable()
       
    await forEveryConnection(async connection => {
        await queryBuilder(TestPeopleModel, connection).insert([
            {
                name: 'Alice',
                age: 25,
                createdAt: new Date(),
                updatedAt: date2024
            },
            {
                name: 'Bob',
                age: 30,
                createdAt: new Date(),
                updatedAt: date2025
            },
        ]);
    })
}

describe('eloquent', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetAndRepopulate()
    });

    test('test ordering', async () => {
        await forEveryConnection(async connection => {
            const query = queryBuilder(TestPeopleModel, connection)

            const resuls = await query.clone().oldest('updatedAt').get();
            expect(resuls.count()).toBe(2);
            expect(resuls[0].name).toBe('Alice');
            expect(resuls[1].name).toBe('Bob');

            const resultsSingleOldest = await query.clone().oldest('updatedAt').first();
            expect(resultsSingleOldest?.name).toBe('Alice');

            const resultsSingleNewest = await query.clone().latest('updatedAt').first();
            expect(resultsSingleNewest?.name).toBe('Bob');
        })
        
    })
});