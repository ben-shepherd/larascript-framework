import { IDatabaseQuery } from "./IDatabaseQuery";

export interface IDatabaseService
{
    boot(): Promise<void>;
    query(connectionName?: string): IDatabaseQuery;
}