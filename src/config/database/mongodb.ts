import IMongoDbConfig from "@src/core/domains/Database/mongodb/interfaces/IMongoDbConfig";

const config: IMongoDbConfig = {
    /**
     * The default connection when accessing database
     */
    connection: (process.env.MONGODB_CONNECTION as string) ?? 'default',
    
    /**
     * The additional connections to keep-alive.
     * 
     * Value must be your connection name commma seperated.
     * Example: secondary,externalDb
     */
    keepAliveConnections: (process.env.MONGO_CONNECTIONS_KEEP_ALIVE as string) ?? '',

    /**
     * Configure your connections
     */
    connections: {
        default: {
            uri: process.env.MONGODB_URI as string,
            options: {}
        }
    }
};

export default config