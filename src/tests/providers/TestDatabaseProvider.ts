import ParseMongoDBConnectionString from '@src/core/domains/database/helper/ParseMongoDBConnectionUrl';
import ParsePostgresConnectionUrl from '@src/core/domains/database/helper/ParsePostgresConnectionUrl';
import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import DatabaseAdapter from '@src/core/domains/database/services/DatabaseAdapter';
import DatabaseConfig from '@src/core/domains/database/services/DatabaseConfig';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
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
        // keepAliveConnections: 'mongodb',
        keepAliveConnections: '',
        connections: {
            // mongodb: {
            //     driver: 'mongodb',
            //     uri: mongoDbConnectionStringWithTestDb,
            //     options: {}
            // },
            postgres: DatabaseConfig.createConfig(PostgresAdapter, {
                uri: postgresConnectionStringWithTestDb,
                options: {}
            })
        },
        adapters: [
            DatabaseAdapter.createAdapter({
                package: 'pg',
                adapter: PostgresAdapter
            })
        ]
    };
    ;

}