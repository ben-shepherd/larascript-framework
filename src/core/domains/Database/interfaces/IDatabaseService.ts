import { DbTypeHelpers } from "@src/config/database";
import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

type Client = DbTypeHelpers['client'];
type Provider = DbTypeHelpers['provider'] extends IDatabaseProvider ? DbTypeHelpers['provider'] : IDatabaseProvider;
type Query = DbTypeHelpers['query'] extends IDatabaseQuery ? DbTypeHelpers['query'] : IDatabaseQuery
type Schema = DbTypeHelpers['schema'] extends IDatabaseSchema ? DbTypeHelpers['schema'] : IDatabaseSchema;

export interface IDatabaseService
{
    boot(): Promise<void>;
    getClient<T = Client>(): T;
    provider<T = Provider>(connectionName?: string): T;
    isProvider(driver: string, connectionName?: string): boolean;
    query<T = Query>(connectionName?: string): T;
    schema<T = Schema>(connectionName?: string): T;
}