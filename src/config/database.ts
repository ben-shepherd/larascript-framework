import { MongoDBTypes } from "@src/core/domains/database/interfaces/DatabaseProviderTypes";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";

// Default connection string, fallback to 'default' if not set in environment
const DEFAULT_CONNECTION = (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default';

// Default database provider, fallback to 'mongodb' if not set in environment
const DEFAULT_PROVIDER = (process.env.DATABASE_DEFAULT_PROVIDER as string) ?? 'mongodb';

/**
 * Type definition for database-specific helpers.
 * This type is used to provide type awareness when accessing the database through App.container('db').
 * 
 * Example usage:
 *  DbTypeHelpers = MongoDBTypes
 *  DbTypeHelpers = PostgresTypes
 * 
 * This allows for type-safe access like: App.container('db').client().createCollection('users')
 * 
 * Important Note:
 *  1. Default Connection: This type helper primarily benefits the default database connection.
 *     It provides automatic type inference for methods like App.container('db').client().
 * 
 *  2. Multiple Connections: For applications using multiple database connections:
 *     a) The type helper applies to the default connection only.
 *     b) For other connections, you need to specify the type explicitly:
 *        Example: App.container('db').client<PostgresClient>('postgresConnection')
 * 
 *  3. Type Safety: Always ensure that the DbTypeHelpers accurately reflects your actual database setup.
 *     Mismatches between the type definition and the real database driver can lead to runtime errors.
 * 
 *  4. Updating: Remember to update DbTypeHelpers when changing default database drivers
 *     to maintain accurate type information throughout your application.
 */
export type DbTypeHelpers = MongoDBTypes

/**
 * Database configuration object implementing IDatabaseConfig interface.
 * This object defines the overall structure and settings for database connections.
 */
const config: IDatabaseConfig = {

    // Name of the default database connection to be used
    defaultConnectionName: DEFAULT_CONNECTION,

    // Comma-separated list of connection names to keep alive
    keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',

    /**
     * Database connections configuration.
     * Define multiple connections here if needed.
     */
    connections: {
        /**
         * Default connection configuration.
         * Uses environment variables for flexible deployment across different environments.
         */
        [DEFAULT_CONNECTION]: {
            driver: DEFAULT_PROVIDER,
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {} // Additional connection options can be specified here
        },
        // Add more connection configurations as needed
    },
};

export default config;