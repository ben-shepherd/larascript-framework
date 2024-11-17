/* eslint-disable no-unused-vars */
import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseSchema } from "./IDatabaseSchema";
import { IDocumentManager } from "./IDocumentManager";

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

    getQueryBuilderCtor(): ICtor<unknown>;

    isConnected(): Promise<boolean>;

    getDockerComposeFileName(): string;
}