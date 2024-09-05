import { IDatabaseConfig } from '@src/core/domains/database/interfaces/IDatabaseConfig';
import DatabaseProvider from '@src/core/domains/database/providers/DatabaseProvider';
import defaultCredentials from '@src/core/domains/setup/utils/defaultCredentials';

export default class TestDatabaseProvider extends DatabaseProvider
{
    protected config!: IDatabaseConfig;

    constructor() {
        super();
        this.setupMockConfig()
    }

    private setupMockConfig()
    {
        const defaultMongoDbCredentials = defaultCredentials.extractDefaultMongoDBCredentials();
        const defaultPostgresCredentials = defaultCredentials.extractDefaultPostgresCredentials();

        if(!defaultMongoDbCredentials || !defaultPostgresCredentials) {
            throw new Error('Invalid default credentials');
        }

        this.config = {
            defaultConnectionName: 'mongodb',
            keepAliveConnections: 'postgres',
            connections: {
                mongodb: {
                    driver: 'mongodb',
                    uri: defaultMongoDbCredentials,
                    options: {}
                },
                postgres: {
                    driver: 'postgres',
                    uri: defaultPostgresCredentials,
                    options: {}
                }
            }
        };
    }
}