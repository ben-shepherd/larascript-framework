import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";

import Limit from "./Limit";
import Match from "./Match";
import Order from "./Order";
import Project from "./Project";
import Skip from "./Skip";
import Sort from "./Sort";

export type MongoRaw = object | object[]

/**
 * PipelineBuilder class for constructing MongoDB aggregation pipelines.
 * Extends BaseExpression to provide query building functionality.
 * 
 * @class PipelineBuilder
 * @extends {BaseExpression<unknown>}
 */
class PipelineBuilder extends BaseExpression<unknown> {

    bindingsUtility: unknown;

    /** Raw MongoDB where conditions to be merged with builder conditions */
    rawWhere: MongoRaw | null = null;

    /** Raw MongoDB projections to be merged with builder projections */
    rawSelect: MongoRaw | null = null;

    /** The pipeline to build */
    pipeline: object[] = [];

    /**
     * Builds the $project stage of the aggregation pipeline
     * @returns {object|null} The $project pipeline stage or null if no columns are specified
     */
    buildProject() {
        return Project.getPipeline(this.columns)
    }

    /**
     * Builds the $match stage of the aggregation pipeline
     * @returns {object|null} The $match pipeline stage or null if no conditions are specified
     */
    buildMatch() {
        return Match.getPipeline(this.whereClauses, this.rawWhere)
    }

    /**
     * Builds the $match stage of the aggregation pipeline as a filter object
     * @returns {object|null} The $match pipeline stage as a filter object or null if no conditions are specified
     */
    buildMatchAsFilterObject(): object | null {
        const match = Match.getPipeline(this.whereClauses, this.rawWhere)?.['$match']

        if(!match) return null
        
        return match as object
    }

    /**
     * Builds the $sort stage of the aggregation pipeline
     * @returns {object|null} The $sort pipeline stage or null if no sorting is specified
     */
    buildSort() {   
        return Sort.getPipeline(this.orderByClauses)
    }
    
    /**
     * Builds the $limit stage of the aggregation pipeline
     * @returns {object|null} The $limit pipeline stage or null if no limit is specified
     */
    buildLimit() {
        return Limit.getPipeline(this.offsetLimit?.limit ?? null)
    }

    /**
     * Builds the $skip stage of the aggregation pipeline
     * @returns {object|null} The $skip pipeline stage or null if no offset is specified
     */
    buildSkip() {
        return Skip.getPipeline(this.offsetLimit?.offset ?? null)
    }

    /**
     * Builds the $order stage of the aggregation pipeline
     * @returns {object|null} The $order pipeline stage or null if no ordering is specified
     */
    buildOrder() {
        return Order.getPipeline(this.orderByClauses)
    }

    /**
     * Adds a pipeline stage to the builder
     * @param pipeline - The pipeline stage to add
     */ 
    addPipeline(pipeline: object[]) {
        this.pipeline.push(...pipeline)
    }

    /**
     * Sets the pipeline
     * @param pipeline - The pipeline to set
     */
    setPipeline(pipeline: object[]) {
        this.pipeline = pipeline
    }

    /**
     * Gets the pipeline
     * @returns {object[]} The pipeline
     */
    getPipeline() {
        return this.pipeline
    }

    /**
     * Builds the complete MongoDB aggregation pipeline by combining all stages
     * 
     * @template T - The expected return type of the pipeline
     * @returns {T} The complete aggregation pipeline array
     * @throws {ExpressionException} If the resulting pipeline is empty
     */
    build<T = unknown>(): T {

        // Reset the pipeline
        this.pipeline = []

        // Build the pipeline stages
        const match = this.buildMatch()
        const project = this.buildProject()
        const sort = this.buildSort()
        const limit = this.buildLimit()
        const skip = this.buildSkip()
        const order = this.buildOrder()

        if(match) {
            this.addPipeline([match]);
        }
        if(project) {
            this.addPipeline([project]);
        }
        if(sort) {
            this.addPipeline([sort]);
        }
        if(limit) {
            this.addPipeline([limit]);
        }
        if(skip) {
            this.addPipeline([skip]);
        }
        if(order) {
            this.addPipeline([order]);
        }

        return this.pipeline as T;
    }

}

export default PipelineBuilder