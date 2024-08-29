import { IMongoDBConfig } from "../exceptions/mongodb/IMongoDBConfig";
import { IDatabaseQuery } from "./IDatabaseQuery";

export type IDatabaseDriverCtor = new (config: IMongoDBConfig) => IDatabaseDriver;

export interface IDatabaseDriver {
    connect(): Promise<void>;
    getClient(): any;
    query(): IDatabaseQuery;
}