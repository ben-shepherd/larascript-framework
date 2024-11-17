import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import DatabaseAdapter from "@src/core/domains/database/services/DatabaseAdapter";
import DatabaseConfig from "@src/core/domains/database/services/DatabaseConfig";
import MongoDbAdapter from "@src/core/domains/mongodb/adapters/MongoDbAdapter";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";

// Default connection string, fallback to 'default' if not set in environment
const DEFAULT_CONNECTION = (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default';

const MONGODB_CONNECTION = 'mongodb';

const POSTGRES_CONNECTION = 'postgres';

/**
 * Database configuration object implementing IDatabaseConfig interface.
 * This object defines the overall structure and settings for database connections.
 */
const config: IDatabaseConfig = {

    // Name of the default database connection to be used
    defaultConnectionName:  DEFAULT_CONNECTION,

    // Comma-separated list of connection names to keep alive
    keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',

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
            adapter: DatabaseAdapter.getName(MongoDbAdapter),
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {} // Additional connection options can be specified here
        }),

        /**
         * Default Postgres connection
         */
        DatabaseConfig.createConfig({
            connectionName: POSTGRES_CONNECTION,
            adapter: DatabaseAdapter.getName(PostgresAdapter),
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {} // Additional connection options can be specified here
        })
    ]),

    /**
     * Database adapters configuration.
     */
    adapters: [
        DatabaseAdapter.createAdapterConfig(MongoDbAdapter),
        DatabaseAdapter.createAdapterConfig(PostgresAdapter),
    ]
};

export default config;