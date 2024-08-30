import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";
import IModelData from "@src/core/interfaces/IModelData";

export type IHasManyCtor = new () => IHasMany;

export interface IHasManyOptions {
    localModel: IModel<IModelData>;
    localKey: keyof IModelData;
    foreignModelCtor: ModelConstructor<IModel<IModelData>>;
    foreignKey: keyof IModelData;
    filters?: object;
}

export interface IHasMany {
    handle(
        connection: string,
        options: IHasManyOptions
    ): Promise<IModelData[]>;
}