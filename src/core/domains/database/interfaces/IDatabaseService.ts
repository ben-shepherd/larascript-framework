/* eslint-disable no-unused-vars */
import { ConnectionTypeHelpers } from "@src/config/database";
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IHasConfigConcern } from "@src/core/interfaces/concerns/IHasConfigConcern";
import { ICtor } from "@src/core/interfaces/ICtor";


export interface IDatabaseService extends IHasConfigConcern<IDatabaseConfig>
{
    boot(): Promise<void>;

    showLogs(): boolean
    
    getDefaultConnectionName(): string;

    setDefaultConnectionName(connectionName: string): void;

    getAdapter<K extends keyof ConnectionTypeHelpers = 'default'>(connectionName?: K | string): ConnectionTypeHelpers[K];

    getAdapterConstructor<T extends ICtor<IDatabaseAdapter> = ICtor<IDatabaseAdapter>>(connectionName?: string): T;

    getAllAdapterConstructors(): ICtor<IDatabaseAdapter>[]

    isConnectionAdapter(adapter: ICtor<IDatabaseAdapter>, connectionName?: string): boolean

    getDefaultCredentials(adapterName: string): string | null;

    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;

    createMigrationSchema(tableName: string, connectionName?: string): Promise<unknown>;
}