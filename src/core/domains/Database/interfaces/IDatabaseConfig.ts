import IMongoDbConfig from "../mongodb/interfaces/IMongoDbConfig";

export interface IDatabaseConfig {
    mongodb: IMongoDbConfig;
    postgres: null
}