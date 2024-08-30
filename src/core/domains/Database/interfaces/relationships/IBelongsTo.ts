import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";

export type IBelongsToCtor = new () => IBelongsTo;

export interface IBelongsToOptions {
    localModel: IModel<IModelData>;
    localKey: keyof IModelData;
    foreignModelCtor: ModelConstructor<IModel<IModelData>>;
    foreignKey: keyof IModelData;
    filters?: object;
}

export interface IBelongsTo {
    handle(
        connection: string,
        options: IBelongsToOptions
    ): Promise<IModelData | null>;
}