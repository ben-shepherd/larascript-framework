/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

export type IDatabaseProviderCtor = new (connectionName: string, config: any) => IDatabaseProvider;

/**
 * Interface for database driver
 */
export interface IDatabaseProvider {

    /**
     * The name of the connection
     */
    connectionName: string;

    /**
     * Connect to the database
     *
     * @returns A promise that resolves when the connection is established
     */
    connect(): Promise<void>;

    /**
     * Get the raw database client
     */
    getClient(): any;

    /**
     * Get a query interface for the database
     */
    documentManager(): IDocumentManager;

    /**
     * Get a schema interface for the database
     */
    schema(): IDatabaseSchema;
}
