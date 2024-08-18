import { Collection } from "mongodb";
import { IModel, ModelConstructor } from "./IModel";

export type RepositoryConstructor<
    Model extends IModel = IModel,
    Repository extends IRepository<Model> = IRepository<Model>
> = new (collectionName?: string, modelCtor?: ModelConstructor) => Repository;

export type RepositoryInstance<RCtor extends RepositoryConstructor<any>> = InstanceType<RCtor>

export interface IRepository<Model extends IModel = IModel> {
    /**
     * Collection name
     */
    collectionName: string;
    /**
     * Connection name
     */
    connection: string;
    /**
     * Model Constructor
     */
    modelCtor: ModelConstructor<Model>;
    /**
     * Get the MongoDB Collection
     */
    collection(): Promise<Collection>    
    /**
     * Find or fail if no document found
     * @param filter 
     * @returns 
     */
    findOrFail: (filter: object) => Promise<Model>
    /**
     * Find document by _id
     * @param id 
     * @returns 
     */
    findById: (id: string) => Promise<Model | null>
    /**
     * Find a single document
     * @param query 
     * @returns 
     */
    findOne: (query: object) => Promise<Model | null>
    /**
     * Find multiple documents
     * @param query 
     * @returns 
     */
    findMany: (query: object) => Promise<Model[]>
}