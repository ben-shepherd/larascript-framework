/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

import { IDatabaseAdapter } from "./IDatabaseAdapter";

export interface IDatabaseService
{
    boot(): Promise<void>;
    getDefaultConnectionName(): string;
    setDefaultConnectionName(connectionName: string): void;
    getClient<TClient = unknown>(connectionName?: string): TClient;
    getAdapter<TAdapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): TAdapter;
    isAdapter(adapterName: string, connectionName?: string): boolean;
    documentManager<TDocMan extends IDocumentManager = IDocumentManager>(connectionName?: string): TDocMan;
    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;
}