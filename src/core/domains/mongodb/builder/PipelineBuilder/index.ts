import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";

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
    buildMatchAsFilterObject() {
        const match = Match.getPipeline(this.whereClauses, this.rawWhere)?.['$match']

        if(!match) return null
        
        return match
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

    buildOrder() {
        return Order.getPipeline(this.orderByClauses)
    }

    /**
     * Builds the complete MongoDB aggregation pipeline by combining all stages
     * 
     * @template T - The expected return type of the pipeline
     * @returns {T} The complete aggregation pipeline array
     * @throws {ExpressionException} If the resulting pipeline is empty
     */
    build<T = unknown>(): T {

        const project = this.buildProject()
        const match = this.buildMatch()
        const sort = this.buildSort()
        const limit = this.buildLimit()
        const skip = this.buildSkip()
        const order = this.buildOrder()

        const pipeline: object[] = [];

        if(project) {
            pipeline.push(project);
        }
        if(match) {
            pipeline.push(match);
        }
        if(sort) {
            pipeline.push(sort);
        }
        if(limit) {
            pipeline.push(limit);
        }
        if(skip) {
            pipeline.push(skip);
        }
        if(order) {
            pipeline.push(order);
        }

        // if(pipeline.length === 0) {
        //     throw new ExpressionException('Pipeline is empty');
        // }

        return pipeline as T;
    }

}

export default PipelineBuilder