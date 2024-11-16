import { ICtor } from "@src/core/interfaces/ICtor";

import { IDatabaseSchema } from "./IDatabaseSchema";
import { IDocumentManager } from "./IDocumentManager";

export interface IDatabaseAdapter {

    getClient(): unknown;

    connect(): Promise<unknown>;

    connectToDatabase(...args: any[]): Promise<unknown>;

    getDocumentManager(): IDocumentManager;

    getSchema(): IDatabaseSchema;

    getQueryBuilderCtor(): ICtor<unknown>;
}