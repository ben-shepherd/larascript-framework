/* eslint-disable no-unused-vars */
import { IModel, IModelAttributes } from "@src/core/interfaces/IModel";

import Collection from "../../collections/Collection";
import { IEloquent, IRelationship } from "./IEloquent";

export interface IRelationshipResolver<Model extends IModel = IModel> {
    resolveData<Attributes extends IModelAttributes = IModelAttributes, K extends keyof Attributes = keyof Attributes>(model: Model, relationship: IRelationship, connection: string): Promise<Attributes[K] | Collection<Attributes[K] | null>>;
    attachEloquentRelationship(eloquent: IEloquent, relationship: IRelationship, relationshipName: string): IEloquent;
}

export interface IRelationshipResolverConstructor<Model extends IModel = IModel> {
    new (connection: string): IRelationshipResolver<Model>;
}