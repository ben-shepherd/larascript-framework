import { describe, expect, test } from '@jest/globals';
import ParsePostgresConnectionUrl from '@src/core/domains/database/helper/ParsePostgresConnectionUrl';

describe('test parsing a postgres connection string', () => {

    test('parse a postgres connection string', () => {
        const exampleConnectionString = 'postgres://username:password@localhost:5432/database';

        const parsedConnectionString = ParsePostgresConnectionUrl.parse(exampleConnectionString);
    
        expect(parsedConnectionString).toEqual({
            host: 'localhost',
            port: 5432,
            username: 'username',
            password: 'password',
            database: 'database'
        })      
    })

});