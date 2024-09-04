import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

export type IDatabaseProviderCtor = new (config: any) => IDatabaseProvider;

/**
 * Interface for database driver
 */
export interface IDatabaseProvider {
    connect(): Promise<void>;
    getClient(): any;
    documentManager(): IDocumentManager;
    schema(): IDatabaseSchema;
}