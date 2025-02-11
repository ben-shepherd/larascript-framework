import { ModelConstructor } from "@src/core/interfaces/IModel";

import { TWhereClauseValue } from "../../eloquent/interfaces/IEloquent";
import { queryBuilder } from "../../eloquent/services/EloquentQueryBuilderService";
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

type UniqueRuleOptions = {
    table: ModelConstructor;
    column: string;
}

class UniqueRule extends AbstractRule<UniqueRuleOptions> implements IRule {

    protected name: string = 'unique';

    protected errorTemplate: string = 'The :attribute field must be unique.';

    constructor(tableOrModel: ModelConstructor, column: string) {
        super();
        this.options = {
            table: tableOrModel,
            column
        };
    }

    public async test(): Promise<boolean> {
        return await queryBuilder(this.options.table)
            .where(this.options.column, this.getData() as TWhereClauseValue)
            .count() === 0;
    }

}

export default UniqueRule; 