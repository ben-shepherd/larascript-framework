import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import DatabaseConfig from '@src/core/domains/database/services/DatabaseConfig';
import MongoDbAdapter from '@src/core/domains/mongodb/adapters/MongoDbAdapter';
import ParseMongoDBConnectionString from '@src/core/domains/mongodb/helper/ParseMongoDBConnectionUrl';
import { IMongoConfig } from '@src/core/domains/mongodb/interfaces/IMongoConfig';
import PostgresAdapter from '@src/core/domains/postgres/adapters/PostgresAdapter';
import ParsePostgresConnectionUrl from '@src/core/domains/postgres/helper/ParsePostgresConnectionUrl';
import { IPostgresConfig } from '@src/core/domains/postgres/interfaces/IPostgresConfig';

export const testDbName = 'test_db';

const defaultMongoDbCredentials = new MongoDbAdapter('', {} as IMongoConfig).getDefaultCredentials()
const defaultPostgresCredentials = new PostgresAdapter('', {} as IPostgresConfig).getDefaultCredentials()

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
        enableLogging: true,
        defaultConnectionName: 'postgres',
        keepAliveConnections: 'mongodb',
        connections: DatabaseConfig.createConnections([
            DatabaseConfig.createConfig({
                connectionName: 'postgres',
                adapter: PostgresAdapter,
                uri: postgresConnectionStringWithTestDb,
                options: {} // Additional connection options can be specified here
            }),
            DatabaseConfig.createConfig({
                connectionName: 'mongodb',
                adapter: MongoDbAdapter,
                uri: mongoDbConnectionStringWithTestDb,
                options: {} // Additional connection options can be specified here
            })
        ])
    };
    ;

}