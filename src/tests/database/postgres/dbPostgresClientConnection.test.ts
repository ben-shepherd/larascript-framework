/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { Client } from 'pg';



describe('test postgres client connection', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('test connection', async () => {

        const client = App.container('db').provider<PostgresAdapter>().getPgClient()

        await client.connect()

        expect(client).toBeInstanceOf(Client)
        client.query('SELECT 1 as connected', (err, res) => {
            expect(res.rows[0].connected).toBe(1);
            client.end();
        })
    })
});