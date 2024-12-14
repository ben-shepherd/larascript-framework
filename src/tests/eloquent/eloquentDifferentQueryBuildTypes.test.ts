/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { resetPeopleTable } from './models/TestPeopleModel';

const resetAndRepoulateTable = async () => {
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

    test('test insert and select', async () => {
        await resetAndRepoulateTable()

        const initialCount = await query.count()
        expect(initialCount).toBe(4)

        await query.insert({
            name: 'Jack',
            age: 50,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const updatedCount = await query.count()
        expect(updatedCount).toBe(5)

        const results = await query.get()
        expect(results[0].name).toBe('Alice')
        expect(results[1].name).toBe('Bob')
        expect(results[2].name).toBe('Jack')
        expect(results[3].name).toBe('Jane')
        expect(results[4].name).toBe('John')

    })

    test('test insert and delete', async () => {
        await resetAndRepoulateTable()
        
        const initialCount = await query.count()
        expect(initialCount).toBe(4)

        await query.clone().where('name', 'Bob').delete()
        const updatedCount = await query.count()
        expect(updatedCount).toBe(3)

        const results = await query.clone().get()
        expect(results[0].name).toBe('Alice')
        expect(results[1].name).toBe('Jane')
        expect(results[2].name).toBe('John')
    })

    test('test insert and update', async () => {
        await resetAndRepoulateTable()
        
        const initialCount = await query.count()
        expect(initialCount).toBe(4)

        await query.insert({
            name: 'Jack',
            age: 50,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await query.clone().where('name', 'Jack').update({ age: 51 })

        const updatedCount = await query.count()
        expect(updatedCount).toBe(5)

        const results = await query.get()
        expect(results[0].name).toBe('Alice')
        expect(results[1].name).toBe('Bob')
        expect(results[2].name).toBe('Jack')
        expect(results[2].age).toBe(51)
        expect(results[3].name).toBe('Jane')
        expect(results[4].name).toBe('John')
    })

    test('test select and update', async () => {
        await resetAndRepoulateTable()
        
        const initialCount = await query.count()
        expect(initialCount).toBe(4)

        await query.insert({
            name: 'Jack',
            age: 50,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await query.clone().where('name', 'Jack').update({ age: 51 })

        const updatedCount = await query.count()
        expect(updatedCount).toBe(5)

        const jack = await query.clone().where('name', 'Jack').first()
        expect(jack?.name).toBe('Jack')
        expect(jack?.age).toBe(51)
    })

    test('test select and delete and insert', async () => {
        await resetAndRepoulateTable()
        
        const firstBob = await query.clone().where('name', 'Bob').first()
        console.log('firstBob', firstBob)
        expect(firstBob?.name).toBe('Bob')

        await query.clone().where('name', 'Bob').delete()
        const updatedCount = await query.count()
        expect(updatedCount).toBe(3)

        const secondBob = await query.clone().where('name', 'Bob').first()
        expect(secondBob).toBe(null)

        await query.insert({
            name: 'Bob',
            age: 30,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const thirdBob = await query.clone().where('name', 'Bob').first()
        expect(thirdBob?.name).toBe('Bob')
    })

});