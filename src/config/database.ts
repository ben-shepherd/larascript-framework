import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";

const DEFAULT_CONNECTION = (process.env.DATABASE_DEFAULT_CONNECTION as string) ?? 'default';

const config: IDatabaseConfig = {

    defaultConnectionName: DEFAULT_CONNECTION,

    keepAliveConnections: (process.env.DATABASE_CONNECTIONS_KEEP_ALIVE as string) ?? '',

    connections: {

        /**
         * Default configuration
         */
        [DEFAULT_CONNECTION]: {
            driver: process.env.DATABASE_DEFAULT_DRIVER as 'mongodb',
            uri: process.env.DATABASE_DEFAULT_URI as string,
            options: {}
        },
    },




};

export default config