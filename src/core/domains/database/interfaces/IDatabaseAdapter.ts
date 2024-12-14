/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { ICtor } from "@src/core/interfaces/ICtor";
import { IModel } from "@src/core/interfaces/IModel";

import { IEloquent } from "../../eloquent/interfaces/IEloquent";

export type TAdapterComposerFileName = {

    // Example: 'mongodb.yml'
    fullName: string,

    // Example: 'mongodb'
    shortName: string
}

export interface  IDatabaseAdapter {

    getClient(...args: any[]): unknown;

    setClient(...args: any[]): void;

    setConnectionName(...args: any[]): void;

    getConnectionName(...args: any[]): string;

    connetClient(): Promise<unknown>;

    isConnected(): Promise<boolean>;

    /**
     * @deprecated
     */
    getDocumentManager(): IDocumentManager;

    getSchema(): IDatabaseSchema;

    getEloquentConstructor<Model extends IModel = IModel>(): ICtor<IEloquent<Model>>;

    getDockerComposeFileName(): string;

    getDefaultCredentials(): string | null;

    createMigrationSchema(...args: any[]): Promise<unknown>;
}