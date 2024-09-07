import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import defaultCredentials from "@src/core/domains/setup/utils/defaultCredentials";

const defaultMongoDbCredentials = defaultCredentials.extractDefaultMongoDBCredentials();
const defaultPostgresCredentials = defaultCredentials.extractDefaultPostgresCredentials();

if(!defaultMongoDbCredentials || !defaultPostgresCredentials) {
    throw new Error('Invalid default credentials');
}

const testDatabaseConfig: IDatabaseConfig = {
    defaultConnectionName: 'postgres',
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

export const getTestConnectionNames = () => Object.keys(testDatabaseConfig.connections);

export default testDatabaseConfig