import IMongoDbConfig from "@src/core/domains/database/exceptions/mongodb/IMongoDbConfig";

export interface IDatabaseConfig {
    mongodb: IMongoDbConfig;
    postgres: null
}