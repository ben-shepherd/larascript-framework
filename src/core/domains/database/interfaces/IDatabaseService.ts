/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasConfigConcern } from "@src/core/interfaces/concerns/IHasConfigConcern";
import { IHasRegisterableConcern } from "@src/core/interfaces/concerns/IHasRegisterableConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseAdapter } from "./IDatabaseAdapter";
import { IDatabaseConfig } from "./IDatabaseConfig";

export interface IDatabaseService extends IHasConfigConcern<IDatabaseConfig>, IHasRegisterableConcern
{
    boot(): Promise<void>;
    
    getDefaultConnectionName(): string;

    setDefaultConnectionName(connectionName: string): void;

    getClient<TClient = unknown>(connectionName?: string): TClient;

    getAdapter<TAdapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): TAdapter;

    getAllAdapterConstructors(): ICtor<IDatabaseAdapter>[]

    isAdapter(adapterName: string, connectionName?: string): boolean;

    documentManager<TDocMan extends IDocumentManager = IDocumentManager>(connectionName?: string): TDocMan;

    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;
}