import { ModelConstructor } from "@src/core/interfaces/IModel";

import { IEloquent, TOperator, TWhereClause, TWhereClauseValue } from "../../eloquent/interfaces/IEloquent";
import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

type UniqueRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
}

class UniqueRule extends AbstractRule<UniqueRuleOptions> implements IRule {

    protected name: string = 'unique';

    protected errorTemplate: string = 'The :attribute field must be unique.';

    protected builder: IEloquent;

    protected caseInsensitive: boolean = false;

    constructor(tableOrModel: ModelConstructor, column: string) {
        super();
        this.options = {
            modelConstructor: tableOrModel,
            column
        };
        this.builder = queryBuilder(this.options.modelConstructor);
    }

    public where(column: TWhereClause['column'], operator: TOperator, value: TWhereClauseValue): this {
        this.builder.where(column, operator, value);
        return this;
    }

    public query(): IEloquent {
        return this.builder;
    }

    public async test(): Promise<boolean> {
        return await this.query()
            .where(this.options.column, this.getData() as TWhereClauseValue)
            .count() === 0;
    }

}

export default UniqueRule; 