/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import Collection from '@src/core/domains/collections/Collection';
import { IEloquent } from '@src/core/domains/eloquent/interfaces/IEloquent';
import testHelper from '@src/tests/testHelper';

import TestPeopleModel, { ITestPeopleModelData, resetTable } from './models/TestPeopleModel';


describe('eloquent', () => {

    let query!: IEloquent<ITestPeopleModelData>;
    let inserted!: Collection<ITestPeopleModelData>;

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetTable()

        query = TestPeopleModel.query<ITestPeopleModelData>()
            .orderBy('createdAt', 'asc');

        const dateOneYearInPast = new Date();
        dateOneYearInPast.setFullYear(dateOneYearInPast.getFullYear() - 1);

        inserted = await query.insert([
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
                createdAt: dateOneYearInPast,
                updatedAt: dateOneYearInPast
            },
            {
                name: 'Jane',
                age: 45,
                createdAt: dateOneYearInPast,
                updatedAt: dateOneYearInPast
            }
        ]);
    });

    test('test raw where', async () => {
        
        const resultsOnlyJohn = await query.whereRaw('"name" = $1', ['John']).first()
        expect(resultsOnlyJohn?.id).toBe(inserted[2].id);
        expect(resultsOnlyJohn?.name).toBe('John');
    })

    test('test equals', async () => {
    
        const resultsOnlyJohn = await query.clone()
            .where('name', 'John')
            .get();
        expect(resultsOnlyJohn.count()).toBe(1);
        expect(resultsOnlyJohn[0].name).toBe('John');

    })

    test('test equals with OR operator', async () => {

        const resultsOnlyJohnOrJane = await query.clone()
            .where('name', '=', 'John')
            .orWhere('name', '=', 'Jane')
            .get();

        expect(resultsOnlyJohnOrJane.count()).toBe(2);
        expect(resultsOnlyJohnOrJane[0].name).toBe('John');
        expect(resultsOnlyJohnOrJane[1].name).toBe('Jane');    
        
        const resultsYoungerThan30OrOlderThan40 = await query.clone()
            .where('age', '<', 30)
            .orWhere('age', '>', 40)
            .get();

        expect(resultsYoungerThan30OrOlderThan40.count()).toBe(2);
        expect(resultsYoungerThan30OrOlderThan40[0].name).toBe('Alice');
        expect(resultsYoungerThan30OrOlderThan40[1].name).toBe('Jane');

    })

    test('test greater than and greater than or equal', async () => {
        
        const resultsGreaterThan35YearsOld = await query.clone().where('age', '>', 35).get();
        expect(resultsGreaterThan35YearsOld.count()).toBe(1);
        expect(resultsGreaterThan35YearsOld[0].name).toBe('Jane');

        const resultsGreaterThanOrEqual35YearsOld = await query.clone().where('age', '>=', 35).get();
        expect(resultsGreaterThanOrEqual35YearsOld.count()).toBe(2);
        expect(resultsGreaterThanOrEqual35YearsOld[0].name).toBe('John');
        expect(resultsGreaterThanOrEqual35YearsOld[1].name).toBe('Jane');
    
    })

    test('test less than and less than or equal', async () => {
        
        const resultsLessThan30YearsOld = await query.clone().where('age', '<', 30).get();
        expect(resultsLessThan30YearsOld.count()).toBe(1);
        expect(resultsLessThan30YearsOld[0].name).toBe('Alice');

        const resultsLessThan30YearsOldOrEqual = await query.clone().where('age', '<=', 30).get();
        expect(resultsLessThan30YearsOldOrEqual.count()).toBe(2);
        expect(resultsLessThan30YearsOldOrEqual[0].name).toBe('Alice');
        expect(resultsLessThan30YearsOldOrEqual[1].name).toBe('Bob');
        
    });

    test('test where in and where not in', async () => {
        
        const results25And30 = await query.clone().whereIn('age', [25, 30]).get();
        expect(results25And30.count()).toBe(2);
        expect(results25And30[0].name).toBe('Alice');
        expect(results25And30[1].name).toBe('Bob');

        const resultsExclude25 = await query.clone().whereNotIn('age', [25]).get();
        expect(resultsExclude25.count()).toBe(3);
        expect(resultsExclude25[0].name).toBe('Bob');
        expect(resultsExclude25[1].name).toBe('John');
        expect(resultsExclude25[2].name).toBe('Jane');

    })

    test('test where in between and where not in between', async () => {

        const resultBetween31And39 = await query.clone().whereBetween('age', [31, 39]).get();
        expect(resultBetween31And39.count()).toBe(1);
        expect(resultBetween31And39[0].name).toBe('John');

        const resultsNotBetween31And39 = await query.clone().whereNotBetween('age', [31, 39]).get();
        expect(resultsNotBetween31And39.count()).toBe(3);
        expect(resultsNotBetween31And39[0].name).toBe('Alice');
        expect(resultsNotBetween31And39[1].name).toBe('Bob');
        expect(resultsNotBetween31And39[2].name).toBe('Jane');
    })
});