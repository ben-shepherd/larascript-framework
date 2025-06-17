
import { TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import AbstractDatabaseRule from "@src/core/domains/validator/abstract/AbstractDatabaseRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

import { db } from "../../database/services/Database";
import { IHttpContext } from "../../http/interfaces/IHttpContext";

type ExistsRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
    // eslint-disable-next-line no-unused-vars
    where?: (context: IHttpContext) => object | null;
}

class ExistsRule extends AbstractDatabaseRule<ExistsRuleOptions> implements IRule {

    protected name: string = 'exists';

    protected errorTemplate: string = 'The :attribute field must exist.';

    constructor(modelConstructor: ModelConstructor, column: string, where?: ExistsRuleOptions['where']) {
        super(modelConstructor, { column, where });
    }

    public async test(): Promise<boolean> {
        if (this.dataUndefinedOrNull()) {
            this.errorMessage = 'The :attribute field is required.'
            return false;
        }

        const column = db().getAdapter().normalizeColumn(this.options.column)
        const builder = this.query()
            .where(column, this.getData() as TWhereClauseValue)

        if (typeof this.options.where === 'function') {
            const where = this.options.where(this.getHttpContext())

            if (where) {
                builder.where(this.getHttpContext())
            }
        }

        return await builder.count() > 0;
    }

}

export default ExistsRule; 