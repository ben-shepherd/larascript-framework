import IModelData from "@src/core/interfaces/IModelData";
import { IDatabaseDocument } from "../IDocumentManager";

export type IHasManyCtor = new () => IHasMany;

export interface IHasManyOptions {
    localKey: keyof IModelData;
    foreignKey: keyof IModelData;
    foreignTable: string;
    filters?: object;
}

export interface IHasMany {
    handle(
        connection: string,
        document: IDatabaseDocument,
        options: IHasManyOptions
    ): Promise<IModelData[]>;
}