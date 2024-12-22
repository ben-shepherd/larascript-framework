
import { IModel } from "@src/core/interfaces/IModel";
import captureError from "@src/core/util/captureError";
import { Document, Collection as MongoCollection } from "mongodb";

import Collection from "../../collections/Collection";
import collect from "../../collections/helper/collect";
import Eloquent from "../../eloquent/Eloquent";
import MongoDbAdapter from "../adapters/MongoDbAdapter";
import PipelineBuilder from "../builder/PipelineBuilder";

class MongoDbEloquent<Model extends IModel> extends Eloquent<Model, PipelineBuilder, MongoDbAdapter> {

    /**
     * The query builder expression object
     */
    protected expression: PipelineBuilder = new PipelineBuilder()

    /**
     * Retrieves the MongoDB Collection instance for the model.
     * @param collectionName Optional collection name to use. If not provided, the model's table name will be used.
     * @returns The MongoDB Collection instance.
     * @throws Error if the model constructor is not set.
     */
    protected getDbCollection(collectionName?: string): MongoCollection {
        const modelCtor = this.getModelCtor()
        if(!modelCtor) {
            throw new Error('Model constructor is not set');
        }
        if(!collectionName) {
            collectionName = modelCtor.getTable()
        }
        return this.getDatabaseAdapter().getDb().collection(collectionName)
    }

    async raw<T = Document[]>(expression: PipelineBuilder = this.expression): Promise<T> {
        return captureError<T>(async () => {

            const collection = this.getDbCollection();

            const rows = await collection.aggregate(
                expression.build()
            ).toArray();

            return this.applyFormatter(rows) as T;
        })
    }

    async fetchRows<T = unknown>(expression: PipelineBuilder = this.expression): Promise<T> {
        return await captureError<T>(async () => {

            const previousExpression = this.expression.clone()

            this.expression.setBuildTypeSelect()

            const collection = this.getDbCollection();

            const results  = await collection.aggregate(expression.build()).toArray()

            this.setExpression(previousExpression)

            return this.formatterFn ? results.map(this.formatterFn) as T : results as T
        })
    }

    async findMany<T = unknown>(filter: object): Promise<T> {
        return await captureError<T>(async () => {

            this.expression.setBuildTypeSelect()

            const collection = this.getDbCollection();

            const results  = await collection.find(filter).toArray()

            return this.formatterFn ? results.map(this.formatterFn) as T : results as T
        })
    }

    async insert(documents: object | object[]): Promise<Collection<Model>> {
        return captureError(async () => {

            const collection = this.getDbCollection();

            const documentsArray = Array.isArray(documents) ? documents : [documents]

            const inserted = await collection.insertMany(documentsArray)
            const insertedIds = Object.values(inserted.insertedIds)
            const results = await this.findMany<Model[]>({ _id: { $in: insertedIds } })

            return collect<Model>(results)
        })
    }


}

export default MongoDbEloquent