import { ModelConstructor } from "@src/core/interfaces/IModel";

import { TWhereClauseValue } from "../../eloquent/interfaces/IEloquent";
import AbstractDatabaseRule from "../abstract/AbstractDatabaseRule";
import { IRule } from "../interfaces/IRule";

type ExistsRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
}

class ExistsRule extends AbstractDatabaseRule<ExistsRuleOptions> implements IRule {

    protected name: string = 'exists';

    protected errorTemplate: string = 'The :attribute field must exist.';

    constructor(modelConstructor: ModelConstructor, column: string) {
        super(modelConstructor);
        this.options = {
            ...(this.options ?? {}),
            column
        };
    }

    public async test(): Promise<boolean> {
        return await this.query()
            .where(this.options.column, this.getData() as TWhereClauseValue)
            .count() > 0;
    }

}

export default ExistsRule; 