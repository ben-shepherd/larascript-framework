import BaseExpression from "@src/core/domains/eloquent/base/BaseExpression";
import ExpressionException from "@src/core/domains/eloquent/exceptions/ExpressionException";

import Project from "./Project";

class PipelineBuilder extends BaseExpression<unknown> {

    bindingsUtility: unknown;


    build<T = unknown>(): T {

        
        console.log('[PipelineBuilder]', this)

        const project = Project.getPipeline(this.columns)
        // const match = Match.getPipeline(this.whereClauses, this.whereRaw)
        // const sort = Sort.getPipeline(this.orderByClauses, this.orderByRaw)
        // const limit = Limit.getPipeline(this.offsetLimit?.limit)
        // const skip = Skip.getPipeline(this.offsetLimit?.offset)

        // const pipeline = [match, sort, limit, skip, project]
        const pipeline: object[] = [];

        if(project) {
            pipeline.push(project);
        }
        // if(match) {
        //     pipeline.push(match);
        // }
        // if(sort) {
        //     pipeline.push(sort);
        // }
        // if(limit) {
        //     pipeline.push(limit);
        // }

        if(pipeline.length === 0) {
            throw new ExpressionException('Pipeline is empty');
        }

        return {} as T;
    }

}

export default PipelineBuilder