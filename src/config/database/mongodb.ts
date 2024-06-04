import { MongoClientOptions } from "mongodb";
import IMongoDbConfig from "../../interfaces/IMongoDbConfig";
const options: MongoClientOptions = {}

const config: IMongoDbConfig = {
    uri: process.env.MONGODB_URI as string,
    options
};

export default config