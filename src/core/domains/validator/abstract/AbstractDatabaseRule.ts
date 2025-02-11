import { ModelConstructor } from "@src/core/interfaces/IModel";

import { IEloquent, TOperator, TWhereClause, TWhereClauseValue } from "../../eloquent/interfaces/IEloquent";
import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

type TAbstractDatabaseRuleOptions = {
    modelConstructor: ModelConstructor;
}

abstract class AbstractDatabaseRule<Options extends TAbstractDatabaseRuleOptions> extends AbstractRule<Options> implements IRule {

    protected builder!: IEloquent;

    constructor(tableOrModel: ModelConstructor) {
        super();
        this.options = {
            ...(this.options ?? {}),
            modelConstructor: tableOrModel,
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

}

export default AbstractDatabaseRule; 