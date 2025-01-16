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

    test('test updating records', async () => {

        await forEveryConnection(async connection => {
            const query = queryBuilder(TestPeopleModel, connection);

            const inserted = await query.insert([
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
            const results = await query.clone().orderBy('name').get()

            const janeId = results.find(person => person.name === 'Jane')?.id;
            expect(typeof janeId).toBe('string');
            const johnId = results.find(person => person.name === 'John')?.id;
            expect(typeof johnId).toBe('string');

            const updatedFirst = await query.clone().where('name', 'John').update({ age: 26 });
            expect(updatedFirst.count()).toBe(1);
            expect(updatedFirst[0].id).toBe(johnId);
            expect(updatedFirst[0].age).toBe(26);

            const updatedSecond = await query.clone().where('name', 'Jane').update({ age: 31 });
            expect(updatedSecond.count()).toBe(1);
            expect(updatedSecond[0].id).toBe(janeId);
            expect(updatedSecond[0].age).toBe(31);

            const updatedBoth = await query.clone().orderBy('name').updateAll({ age: 27 });
            expect(updatedBoth.count()).toBe(2);
            expect(updatedBoth[0].id).toBe(johnId);
            expect(updatedBoth[0].age).toBe(27);
            expect(updatedBoth[1].id).toBe(janeId);
            expect(updatedBoth[1].age).toBe(27);

        })

    });
});