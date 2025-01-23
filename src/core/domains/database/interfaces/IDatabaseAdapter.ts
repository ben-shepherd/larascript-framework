/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IPrepareOptions } from "@src/core/domains/database/interfaces/IPrepareOptions";
import { IEloquent } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";
import { IRelationshipResolver } from "@src/core/domains/eloquent/interfaces/IEqloeuntRelationship";

export type TAdapterComposerFileName = {

    // Example: 'mongodb.yml'
    fullName: string,

    // Example: 'mongodb'
    shortName: string
}

export interface  IDatabaseAdapter {

    setConnectionName(...args: any[]): void;

    getConnectionName(...args: any[]): string;

    connectDefault(): Promise<unknown>;

    isConnected(): Promise<boolean>;

    getSchema(): IDatabaseSchema;

    getEloquentConstructor<Model extends IModel = IModel>(): ICtor<IEloquent<Model>>;

    getRelationshipResolver(connection: string): IRelationshipResolver;

    getDockerComposeFileName(): string;

    getDefaultCredentials(): string | null;

    createMigrationSchema(...args: any[]): Promise<unknown>;

    prepareDocument<T extends object = object>(document: T, prepareOptions?: IPrepareOptions): T;

    close(): Promise<void>;
}