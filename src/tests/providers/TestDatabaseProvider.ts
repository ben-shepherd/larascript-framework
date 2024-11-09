import ParsePostgresConnectionUrl from '@src/core/domains/database/helper/ParsePostgresConnectionUrl';
import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import defaultCredentials from '@src/core/domains/setup/utils/defaultCredentials';

export const testDbName = 'test_db';

const defaultMongoDbCredentials = defaultCredentials.extractDefaultMongoDBCredentials();
const defaultPostgresCredentials = defaultCredentials.extractDefaultPostgresCredentials();

if (!defaultMongoDbCredentials || !defaultPostgresCredentials) {
    throw new Error('Invalid default credentials');
}

const getPostgresConnectionStringWithTestDb: string = (() => {
    const parsed = ParsePostgresConnectionUrl.parsePostgresConnectionUrl(defaultPostgresCredentials)
    parsed.database = testDbName;
    return parsed.toString()
})();

export default class TestDatabaseProvider extends DatabaseProvider {

    protected config: IDatabaseConfig = {
        defaultConnectionName: 'postgres',
        keepAliveConnections: 'postgres',
        connections: {
            mongodb: {
                driver: 'mongodb',
                uri: defaultMongoDbCredentials!,
                options: {}
            },
            postgres: {
                driver: 'postgres',
                uri: getPostgresConnectionStringWithTestDb,
                options: {}
            }
        }
    };
    ;

}