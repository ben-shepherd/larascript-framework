import { IDocumentManager } from "@src/core/domains/database/interfaces/IDocumentManager";
import { IModel, ModelConstructor } from "@src/core/interfaces/IModel";

/**
 * Constructor type for repositories.
 * @template Model The type of model the repository is for.
 * @template Repository The type of the repository itself.
 */
export type RepositoryConstructor<Model extends IModel = IModel, Repository extends IRepository<Model> = IRepository<Model>> = new (modelCtor?: ModelConstructor, collectionName?: string) => Repository;

/**
 * Instance type of a repository constructor.
 * @template RCtor The repository constructor.
 */

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
     * Get the Database Query
     */
    documentManager(): IDocumentManager;

    /**
     * Find or fail if no document found
     * @param filter 
     * @returns 
     */
    findOrFail: (filter: object) => Promise<Model>

    /**
     * Find document by id
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
    findMany: (query: object, options?: object) => Promise<Model[]>
}