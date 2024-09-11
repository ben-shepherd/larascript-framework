import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import defaultCredentials from "@src/core/domains/setup/utils/defaultCredentials";

const defaultMongoDbCredentials = defaultCredentials.extractDefaultMongoDBCredentials();
const defaultPostgresCredentials = defaultCredentials.extractDefaultPostgresCredentials();

if (!defaultMongoDbCredentials || !defaultPostgresCredentials) {
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

export const getTestConnectionNames = ({ exclude = [] }: { exclude?: string[] } = {}) => {
    return Object.keys(testDatabaseConfig.connections).filter(name => !exclude?.includes(name));
}

export default testDatabaseConfig