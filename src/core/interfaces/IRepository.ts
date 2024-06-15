import { IModel, ModelConstructor } from "./IModel";

export type RepositoryConstructor<
    Model extends IModel,
    Repository extends IRepository<Model>
> = new (collectionName?: string, modelCtor?: ModelConstructor) => Repository;

export interface IRepository<
    Model extends IModel
> {
    collectionName: string;
    connection: string;
    model: ModelConstructor<Model>;
    findById: (id: string) => Promise<Model | null>
    findOne: (query: object) => Promise<Model | null>
    findMany(query: object): Promise<Model[]>
}