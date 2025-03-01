/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import { ModelWithAttributes } from '@src/core/domains/models/interfaces/IModel';
import TestPeopleModel, { resetPeopleTable } from '@src/tests/eloquent/models/TestPeopleModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';
import pg from 'pg';

describe('eloquent', () => {

    const resetAndRepopulateTable = async () => {
        await resetPeopleTable()

        await forEveryConnection(async connection => {
            await queryBuilder(TestPeopleModel, connection).clone().insert([
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
                },
                {
                    name: 'Bob',
                    age: 35,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'Alice',
                    age: 40,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        })
    }

    beforeAll(async () => {
        await testHelper.testBootApp()
    });

    test('raw query (postgres)', async () => {

        await resetAndRepopulateTable()

        await forEveryConnection(async connection => {

            if(connection !== 'postgres') return;
            const query = queryBuilder(TestPeopleModel, connection)
            const sql = `SELECT * FROM ${query.useTable()} WHERE name = $1 OR name = $2 ORDER BY name DESC LIMIT 2`;
            const bindings = ['Alice', 'Bob'];

            const results = await query.clone().raw<pg.QueryResult<NonNullable<TestPeopleModel['attributes']>>>(sql, bindings);
            expect(results.rows.length).toBe(2);
            expect(results.rows[0].name).toBe('Bob');
            expect(results.rows[1].name).toBe('Alice');
        })

    });

    test('raw query (mongo) ', async () => {

        await resetAndRepopulateTable()

        await forEveryConnection(async connection => {
            if(connection !== 'mongodb') return;

            const query = queryBuilder(TestPeopleModel, connection)

            const aggregate: object[] = [
                {
                    $match: {   
                        name: {
                            $in: ['Alice', 'Bob']
                        }
                    }
                }
            ]

            const results = await query.clone().raw<ModelWithAttributes<TestPeopleModel>[]>(aggregate)

            expect(results.length).toBe(2)

        })

    });

});