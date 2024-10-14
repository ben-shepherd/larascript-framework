/* eslint-disable no-unused-vars */
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";
import IModelAttributes from "@src/core/interfaces/IModelData";

export type IBelongsToCtor = new () => IBelongsTo;

export interface IBelongsToOptions {
    localKey: keyof IModelAttributes;
    foreignKey: keyof IModelAttributes;
    foreignTable: string;
    filters?: object;
}

export interface IBelongsTo {
    handle(
        connection: string,
        document: IDatabaseDocument,
        options: IBelongsToOptions
    ): Promise<IModelAttributes | null>;
}