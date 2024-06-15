import IData from "./IData";
import { IModel, ModelConstructor } from "./IModel";

export type RepositoryConstructor<
    Model extends IModel,
    Repository extends IRepository<Model>
> = new (collectionName?: string, modelCtor?: ModelConstructor) => Repository;

export interface IRepository<M extends IModel> {
    model: ModelConstructor<M>;
    findById: (id: string) => Promise<IData | null>
    findOne: (query: object) => Promise<IData | null>
    findMany(query: object): Promise<IData[]>
}