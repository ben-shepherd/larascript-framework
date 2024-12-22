import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";

import Limit from "./Limit";
import Match from "./Match";
import Project from "./Project";
import Skip from "./Skip";
import Sort from "./Sort";

export type MongoRaw = object | object[]

class PipelineBuilder extends BaseExpression<unknown> {

    bindingsUtility: unknown;

    rawWhere: MongoRaw | null = null;

    rawSelect: MongoRaw | null = null;

    buildProject() {
        return Project.getPipeline(this.columns)
    }

    buildMatch() {
        return Match.getPipeline(this.whereClauses, this.rawWhere)
    }

    buildSort() {   
        return Sort.getPipeline(this.orderByClauses)
    }
    
    buildLimit() {
        return Limit.getPipeline(this.offsetLimit?.limit ?? null)
    }

    buildSkip() {
        return Skip.getPipeline(this.offsetLimit?.offset ?? null)
    }

    build<T = unknown>(): T {

        const project = this.buildProject()
        const match = this.buildMatch()
        const sort = this.buildSort()
        const limit = this.buildLimit()
        const skip = this.buildSkip()

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

        if(pipeline.length === 0) {
            throw new ExpressionException('Pipeline is empty');
        }

        return pipeline as T;
    }

}

export default PipelineBuilder