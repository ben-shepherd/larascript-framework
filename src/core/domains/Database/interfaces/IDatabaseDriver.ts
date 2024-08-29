import { IMongoDBConfig } from "@src/core/domains/database/exceptions/mongodb/IMongoDBConfig";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";

export type IDatabaseDriverCtor = new (config: IMongoDBConfig) => IDatabaseDriver;

export interface IDatabaseDriver {
    connect(): Promise<void>;
    getClient(): any;
    query(): IDatabaseQuery;
}