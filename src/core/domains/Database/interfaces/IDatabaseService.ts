import { DbTypeHelpers } from "@src/config/database";
import { IDatabaseProvider } from "@src/core/domains/database/interfaces/IDatabaseProvider";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

type Client = DbTypeHelpers['client'];
type Provider = DbTypeHelpers['provider'] extends IDatabaseProvider ? DbTypeHelpers['provider'] : IDatabaseProvider;
type DocumentManager = DbTypeHelpers['query'] extends IDocumentManager ? DbTypeHelpers['query'] : IDocumentManager
type Schema = DbTypeHelpers['schema'] extends IDatabaseSchema ? DbTypeHelpers['schema'] : IDatabaseSchema;

export interface IDatabaseService
{
    boot(): Promise<void>;
    getClient<T = Client>(): T;
    provider<T = Provider>(connectionName?: string): T;
    isProvider(driver: string, connectionName?: string): boolean;
    documentManager<T = DocumentManager>(connectionName?: string): T;
    schema<T = Schema>(connectionName?: string): T;
}