import { IDatabaseDriver } from "./IDatabaseDriver";
import { IDatabaseQuery } from "./IDatabaseQuery";

export interface IDatabaseService
{
    boot(): Promise<void>;
    driver(connectionName?: string): IDatabaseDriver;
    query(connectionName?: string): IDatabaseQuery;
}