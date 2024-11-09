/* eslint-disable no-undef */
import { describe, test } from '@jest/globals';
import Postgres from '@src/core/domains/database/providers-db/Postgres';
import { App } from '@src/core/services/App';
import testHelper from '@src/tests/testHelper';
import { Client } from 'pg';



describe('test postgres client connection', () => {

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('test connection', async () => {

        const client = App.container('db').provider<Postgres>().getPgClient()

        await client.connect()

        expect(client).toBeInstanceOf(Client)
        client.query('SELECT 1 as connected', (err, res) => {
            expect(res.rows[0].connected).toBe(1);
            client.end();
        })
    })
});