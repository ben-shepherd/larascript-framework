import { EnvironmentProduction } from "@src/core/consts/Environment";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import DatabaseConfig from "@src/core/domains/database/services/DatabaseConfig";
import MongoDbAdapter from "@src/core/domains/mongodb/adapters/MongoDbAdapter";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";
import { appEnv } from "@src/core/services/App";


const DEFAULT_CONNECTION = (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default';
const MONGODB_CONNECTION = 'mongodb';
const POSTGRES_CONNECTION = 'postgres';

/**
 * Type helper for the connection adapters
 */
export type ConnectionTypeHelpers = {
    ['default']: PostgresAdapter;
    [MONGODB_CONNECTION]: MongoDbAdapter;
    [POSTGRES_CONNECTION]: PostgresAdapter;
}

const config: IDatabaseConfig = {

    /**
     * Default database connection name
     */
    defaultConnectionName:  DEFAULT_CONNECTION,

    /**
     * Additional database connections to be kept alive
     * Comma-separated list of connection names
     */
    keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',

    /**
     * Enable logging for the database operations
     */
    enableLogging: appEnv() !== EnvironmentProduction,

    /**
     * Database connections configuration.
     * Define multiple connections here if needed.
     */
    connections: DatabaseConfig.createConnections([

        /**
         * Default MongoDB connection
         */
        DatabaseConfig.createConfig({
            connectionName: MONGODB_CONNECTION,
            adapter: MongoDbAdapter,
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {} // Additional connection options can be specified here
        }),

        /**
         * Default Postgres connection
         */
        DatabaseConfig.createConfig({
            connectionName: POSTGRES_CONNECTION,
            adapter: PostgresAdapter,
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {}, // Additional connection options can be specified here
        })
    ])
};

export default config;