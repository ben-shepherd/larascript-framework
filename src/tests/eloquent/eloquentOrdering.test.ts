/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryService';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetPeopleTable } from './models/TestPeopleModel';

const date2024 = new Date('2024-01-01');
const date2025 = new Date('2025-01-01');

describe('eloquent', () => {

    let query!: IEloquent<TestPeopleModel>;
    
    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetPeopleTable()
        
        query = queryBuilder(TestPeopleModel);

        await query.clone().insert([
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

    });

    test('test oldest', async () => {
        
        const resuls = await query.clone().oldest('updatedAt').get();
        expect(resuls.count()).toBe(2);
        expect(resuls[0].name).toBe('Alice');
        expect(resuls[1].name).toBe('Bob');

        const resultsSingleOldest = await query.clone().oldest('updatedAt').first();
        expect(resultsSingleOldest?.name).toBe('Alice');

        const resultsSingleNewest = await query.clone().latest('updatedAt').first();
        expect(resultsSingleNewest?.name).toBe('Bob');

        
    })
});