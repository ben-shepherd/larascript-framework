/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetPeopleTable } from './models/TestPeopleModel';

const resetTableAndRepopulate = async () => {
    await resetPeopleTable()

    await queryBuilder(TestPeopleModel).insert([
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
}

describe('eloquent', () => {
    let query!: IEloquent<TestPeopleModel>;

    beforeAll(async () => {
        await testHelper.testBootApp()
        query = queryBuilder(TestPeopleModel).orderBy('name', 'asc');
    });

    test('test successful transaction', async () => {

        await resetTableAndRepopulate();

        await query.clone().transaction(async (trx) => {

            await trx.clone().where('name', 'Alice').update({ age: 26 });

            await trx.clone().where('name', 'Bob').update({ age: 31 });

            const results = await trx.clone().get();
            expect(results[0].age).toBe(26);
            expect(results[1].age).toBe(31);

        })

        const results = await query.clone().get();
        expect(results[0].age).toBe(26);
        expect(results[1].age).toBe(31);

    })

    test('test unsuccessful transaction', async () => {

        await resetTableAndRepopulate();
        let exceptionThrown = false;

        try {
            await query.clone().transaction(async (trx) => {
            
                await trx.clone().where('name', 'Alice').update({ age: 26 });

                await trx.clone().where('name', 'Bob').update({ age: 31 });

                throw new Error('Transaction failed');
            })
        }
        catch (error) {
            expect((error as Error).message).toBe('Transaction failed');
            exceptionThrown = true;
        }

        expect(exceptionThrown).toBe(true);

        const results = await query.clone().get();
        expect(results[0].age).toBe(25);
        expect(results[1].age).toBe(30);
    })

});