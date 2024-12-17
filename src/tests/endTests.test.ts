import { describe, test } from '@jest/globals';
import { logger } from '@src/core/domains/logger/services/LoggerService';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import ParsePostgresConnectionUrl from '@src/core/domains/postgres/helper/ParsePostgresConnectionUrl';
import { IPostgresConfig } from '@src/core/domains/postgres/interfaces/IPostgresConfig';
import testHelper from '@src/tests/testHelper';
import pg from 'pg';


describe('end test', () => {

    test('drop postgres test db', async () => {
        const dbToDrop = testHelper.getTestDbName()
        const defaultPostgresCredentials = new PostgresAdapter('', {} as IPostgresConfig).getDefaultCredentials()

        if(!defaultPostgresCredentials) {
            throw new Error('Invalid default credentials');
        }
        
        const credentials = ParsePostgresConnectionUrl.parse(defaultPostgresCredentials);
        
        const client = new pg.Client({
            user: credentials.username,
            password: credentials.password,
            host: credentials.host,
            port: credentials.port,
            database: 'postgres'
        });

        try {
            await client.connect();
            await client.query(`DROP DATABASE IF EXISTS "${dbToDrop}"`)
        }
        catch (err) {
            logger().error('Failed to drop test db', err)
        }
        finally {
            await client.end();
        }    
    })

    // test('drop mongodb test db', async () => {
    //     throw new Error('Not implemented')
    // })
});