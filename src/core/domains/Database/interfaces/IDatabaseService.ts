import { DbTypeHelpers } from "@src/config/database";
import { IDatabaseDriver } from "@src/core/domains/database/interfaces/IDatabaseDriver";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

type Client = DbTypeHelpers['client'];
type Driver = DbTypeHelpers['driver'] extends IDatabaseDriver ? DbTypeHelpers['driver'] : IDatabaseDriver;
type Query = DbTypeHelpers['query'] extends IDatabaseQuery ? DbTypeHelpers['query'] : IDatabaseQuery
type Schema = DbTypeHelpers['schema'] extends IDatabaseSchema ? DbTypeHelpers['schema'] : IDatabaseSchema;

export interface IDatabaseService
{
    boot(): Promise<void>;
    getClient<T = Client>(): T;
    driver<T = Driver>(connectionName?: string): T;
    query<T = Query>(connectionName?: string): T;
    schema<T = Schema>(connectionName?: string): T;
    isDriver(driver: string, connectionName?: string): boolean
}