import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import DatabaseAdapter from "@src/core/domains/database/services/DatabaseAdapter";
import DatabaseConfig from "@src/core/domains/database/services/DatabaseConfig";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";

// Default connection string, fallback to 'default' if not set in environment
const DEFAULT_CONNECTION = (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default';

/**
 * Database configuration object implementing IDatabaseConfig interface.
 * This object defines the overall structure and settings for database connections.
 */
const config: IDatabaseConfig = {

    // Name of the default database connection to be used
    defaultConnectionName:  (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default',

    // Comma-separated list of connection names to keep alive
    keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',

    /**
     * Database connections configuration.
     * Define multiple connections here if needed.
     */
    connections: DatabaseConfig.createConnections([
        DatabaseConfig.createConfig({
            connectionName: DEFAULT_CONNECTION,
            adapter: DatabaseAdapter.getName(PostgresAdapter),
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {} // Additional connection options can be specified here
        })
    ]),

    /**
     * Database adapters configuration.
     */
    adapters: [
        DatabaseAdapter.createAdapter(PostgresAdapter, {
            package: 'pg'
        })
    ]
};

export default config;