/* eslint-disable no-unused-vars */
import { IDatabaseSchema } from "@src/core/domains/database/interfaces/IDatabaseSchema";
import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";

import { IEloquent } from "../../eloquent/interfaces/IEloquent";

export type TAdapterComposerFileName = {

    /**
     * Example: 'docker-compose.mongodb.yml'
     */
    fullName: string,

    /**
     * Example: 'mongodb'
     */
    shortName: string
}

export interface  IDatabaseAdapter {

    getClient(...args: any[]): unknown;

    setClient(...args: any[]): void;

    setConnectionName(...args: any[]): void;

    getConnectionName(...args: any[]): string;

    connect(): Promise<unknown>;

    connectToDatabase(...args: any[]): Promise<unknown>;

    getDocumentManager(): IDocumentManager;

    getSchema(): IDatabaseSchema;

    getEloquent<Data extends object = object>(connectionName: string): IEloquent<Data>;

    isConnected(): Promise<boolean>;

    getDockerComposeFileName(): string;

    getDefaultCredentials(): string | null;

    createMigrationSchema(...args: any[]): Promise<unknown>;
}