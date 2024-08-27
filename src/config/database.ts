import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";

const config: IDatabaseConfig = {

    /**
     * MongoDB configuration
     */
    mongodb: {
        /**
         * The default connection when accessing database
         */
        connection: (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default',
        
        /**
         * The additional connections to keep-alive.
         * 
         * Value must be your connection name commma seperated.
         * Example: secondary,externalDb
         */
        keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',
    
        /**
         * Configure your connections
         */
        connections: {
            default: {
                uri: process.env.DATABASE_DEFAULT_URI as string,
                options: {}
            }
        }
    },

    /**
     * Postgres configuration (Future implementation)
     */
    postgres: null,
};

export default config