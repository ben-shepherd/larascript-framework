import ParseMongoDBConnectionString from '@src/core/domains/database/helper/ParseMongoDBConnectionUrl';
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

const postgresConnectionStringWithTestDb: string = (() => {
    const parsed = ParsePostgresConnectionUrl.parse(defaultPostgresCredentials)
    parsed.database = testDbName;
    return parsed.toString()
})();

const mongoDbConnectionStringWithTestDb: string = (() => {
    const parsed = ParseMongoDBConnectionString.parse(defaultMongoDbCredentials)
    parsed.database = testDbName;
    return parsed.toString()
})();

export default class TestDatabaseProvider extends DatabaseProvider {

    protected config: IDatabaseConfig = {
        defaultConnectionName: 'postgres',
        keepAliveConnections: 'mongodb',
        connections: {
            mongodb: {
                driver: 'mongodb',
                uri: mongoDbConnectionStringWithTestDb,
                options: {}
            },
            postgres: {
                driver: 'postgres',
                uri: postgresConnectionStringWithTestDb,
                options: {}
            }
        }
    };
    ;

}