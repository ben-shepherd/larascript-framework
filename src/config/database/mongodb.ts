import { MongoClientOptions } from "mongodb";
import IMongoDbConfig from "../../core/interfaces/IMongoDbConfig";

const options: MongoClientOptions = {}

const config: IMongoDbConfig = {
    /**
     * The default connection when accessing database
     * Default: 'default'
     */
    connection: 'default',
    /**
     * The additional connections when accessing database
     * Example: ['other]
     */
    keepAliveConnections: [],
    /**
     * Configure your connections
     */
    connections: {
        default: {
            uri: process.env.MONGODB_URI as string,
            options
        }
    }
};

export default config