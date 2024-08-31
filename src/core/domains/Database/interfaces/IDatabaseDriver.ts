import { IDatabaseQuery } from "@src/core/domains/database/interfaces/IDatabaseQuery";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";

export type IDatabaseDriverCtor = new (config: any) => IDatabaseDriver;

export interface IDatabaseDriver {
    connect(): Promise<void>;
    getClient(): any;
    query(): IDatabaseQuery;
    schema(): IDatabaseSchema;
}