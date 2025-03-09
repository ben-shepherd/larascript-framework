/* eslint-disable no-unused-vars */
import { IDatabaseAdapter } from "@src/core/domains/database/interfaces/IDatabaseAdapter";
import { IDatabaseConfig } from "@src/core/domains/database/interfaces/IDatabaseConfig";
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import MongoDbAdapter from "@src/core/domains/mongodb/adapters/MongoDbAdapter";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";
import { TClassConstructor } from "@src/core/interfaces/ClassConstructor.t";
import { IHasConfigConcern } from "@src/core/interfaces/concerns/IHasConfigConcern";
import { IConnectionTypeHelpers } from "@src/core/domains/database/interfaces/IConnectionTypeHelpers";


export interface IDatabaseService extends IHasConfigConcern<IDatabaseConfig>
{
    boot(): Promise<void>;

    showLogs(): boolean
    
    getDefaultConnectionName(): string;

    setDefaultConnectionName(connectionName: string): void;

    getAdapter<K extends keyof IConnectionTypeHelpers = 'default'>(connectionName?: K | string): IConnectionTypeHelpers[K];

    getAdapterConstructor<T extends TClassConstructor<IDatabaseAdapter> = TClassConstructor<IDatabaseAdapter>>(connectionName?: string): T;

    getAllAdapterConstructors(): TClassConstructor<IDatabaseAdapter>[]

    isConnectionAdapter(adapter: TClassConstructor<IDatabaseAdapter>, connectionName?: string): boolean

    getDefaultCredentials(adapterName: string): string | null;

    schema<TSchema extends IDatabaseSchema = IDatabaseSchema>(connectionName?: string): TSchema;

    createMigrationSchema(tableName: string, connectionName?: string): Promise<unknown>;

    postgres(connectionName?: string): PostgresAdapter;

    mongodb(connectionName?: string): MongoDbAdapter;
}