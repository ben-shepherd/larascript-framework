import { IDatabaseDriver } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";

export interface IDatabaseService
{
    boot(): Promise<void>;
    driver(connectionName?: string): IDatabaseDriver;
    query(connectionName?: string): IDatabaseQuery;
}