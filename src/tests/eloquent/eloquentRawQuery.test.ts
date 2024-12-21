/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import TestPeopleModel, { resetPeopleTable } from '@src/tests/eloquent/models/TestPeopleModel';
import testHelper, { forEveryConnection } from '@src/tests/testHelper';
import pg from 'pg';

describe('eloquent', () => {

    const resetAndRepopulateTable = async (connection: string) => {
        await resetPeopleTable()

        return await queryBuilder(TestPeopleModel, connection).clone().insert([
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
    }

    beforeAll(async () => {
        await testHelper.testBootApp()
        await resetPeopleTable()

        await forEveryConnection(async connection => {
            await resetAndRepopulateTable(connection)
        })
    });

    test('raw query (postgres)', async () => {

        const query = queryBuilder(TestPeopleModel, 'postgres')
        const sql = `SELECT * FROM ${query.useTable()} WHERE name = $1 OR name = $2 ORDER BY name DESC LIMIT 2`;
        const bindings = ['Alice', 'Bob'];

        const results = await query.clone().raw<pg.QueryResult<NonNullable<TestPeopleModel['attributes']>>>(sql, bindings);
        expect(results.rows.length).toBe(2);
        expect(results.rows[0].name).toBe('Bob');
        expect(results.rows[1].name).toBe('Alice');

    });

    // test('raw query (mongo) ', async () => {

    // const query = queryBuilder(TestPeopleModel, 'mongodb')

    // TODO: implement

    // });

});