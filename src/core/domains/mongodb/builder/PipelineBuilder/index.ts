import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";

import Match from "./Match";
import Project from "./Project";

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

    build<T = unknown>(): T {

        const project = this.buildProject()
        const match = this.buildMatch()
        // const sort = Sort.getPipeline(this.orderByClauses, this.orderByRaw)
        // const limit = Limit.getPipeline(this.offsetLimit?.limit)
        // const skip = Skip.getPipeline(this.offsetLimit?.offset)

        // const pipeline = [match, sort, limit, skip, project]
        const pipeline: object[] = [];

        if(project) {
            pipeline.push(project);
        }
        if(match) {
            pipeline.push(match);
        }
        // if(sort) {
        //     pipeline.push(sort);
        // }
        // if(limit) {
        //     pipeline.push(limit);
        // }

        if(pipeline.length === 0) {
            throw new ExpressionException('Pipeline is empty');
        }

        return pipeline as T;
    }

}

export default PipelineBuilder