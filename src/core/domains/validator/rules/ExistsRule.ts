
import { TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import AbstractDatabaseRule from "@src/core/domains/validator/abstract/AbstractDatabaseRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

import { db } from "../../database/services/Database";

type ExistsRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
}

class ExistsRule extends AbstractDatabaseRule<ExistsRuleOptions> implements IRule {

    protected name: string = 'exists';

    protected errorTemplate: string = 'The :attribute field must exist.';

    constructor(modelConstructor: ModelConstructor, column: string) {
        super(modelConstructor, { column });
    }

    public async test(): Promise<boolean> {
        if (this.dataUndefinedOrNull()) {
            this.errorMessage = 'The :attribute field is required.'
            return false;
        }

        const column = db().getAdapter().normalizeColumn(this.options.column)

        return await this.query()
            .where(column, this.getData() as TWhereClauseValue)
            .count() > 0;
    }

}

export default ExistsRule; 