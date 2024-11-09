import { describe, expect, test } from '@jest/globals';
import ParsePostgresConnectionUrl from '@src/core/domains/database/helper/parsePostgresConnectionUrl';

describe('test parsing a postgres connection string', () => {

    test('test parsing a postgres connection string', () => {
        const exampleConnectionString = 'postgres://username:password@localhost:5432/database';

        const parsedConnectionString = ParsePostgresConnectionUrl.parsePostgresConnectionUrl(exampleConnectionString);
    
        expect(parsedConnectionString).toEqual({
            host: 'localhost',
            port: 5432,
            username: 'username',
            password: 'password',
            database: 'database'
        })      
    })

});