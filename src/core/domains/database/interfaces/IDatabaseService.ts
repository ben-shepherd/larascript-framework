/* eslint-disable no-unused-vars */
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IHasConfigConcern } from "@src/core/interfaces/concerns/IHasConfigConcern";
import { ICtor } from "@src/core/interfaces/ICtor";

import { IEloquent } from "../../eloquent/interfaces/IEloquent";

export interface IDatabaseService extends IHasConfigConcern<IDatabaseConfig>
{
    boot(): Promise<void>;
    
    getDefaultConnectionName(): string;

    setDefaultConnectionName(connectionName: string): void;

    getClient<TClient = unknown>(connectionName?: string): TClient;

    getAdapter<TAdapter extends IDatabaseAdapter = IDatabaseAdapter>(connectionName?: string): TAdapter;

    getAdapterConstructor<T extends ICtor<IDatabaseAdapter> = ICtor<IDatabaseAdapter>>(connectionName?: string): T;

    getAllAdapterConstructors(): ICtor<IDatabaseAdapter>[]

    isConnectionAdapter(adapter: ICtor<IDatabaseAdapter>, connectionName?: string): boolean

    getDefaultCredentials(adapterName: string): string | null;

    documentManager<TDocMan extends IDocumentManager = IDocumentManager>(connectionName?: string): TDocMan;

    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;

    eloquent<Data extends object = object>(connectionName?: string): IEloquent<Data>;

    createMigrationSchema(tableName: string, connectionName?: string): Promise<unknown>;
}