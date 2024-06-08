import { MongoClientOptions } from "mongodb";
import IMongoDbConfig from "../../core/interfaces/IMongoDbConfig";

const options: MongoClientOptions = {}

const config: IMongoDbConfig = {
    connection: 'default',
    connections: {
        default: {
            uri: process.env.MONGODB_URI as string,
            options
        },
        other: {
            uri: process.env.MONGODB_URI_OTHER as string,
            options
        }
    }
};

export default config