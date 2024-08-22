import IMongoDbConfig from "@src/core/domains/database/mongodb/interfaces/IMongoDbConfig";

export interface IDatabaseConfig {
    mongodb: IMongoDbConfig;
    postgres: null
}