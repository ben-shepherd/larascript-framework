import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

export type IDatabaseProviderCtor = new (config: any) => IDatabaseProvider;

/**
 * Interface for database driver
 */
export interface IDatabaseProvider {
    connect(): Promise<void>;
    getClient(): any;
    query(): IDatabaseQuery;
    schema(): IDatabaseSchema;
}