
import { IEloquent, TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import AbstractDatabaseRule from "@src/core/domains/validator/abstract/AbstractDatabaseRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";
import { db } from "@src/core/domains/database/services/Database";
import { IHttpContext } from "@src/core/domains/http/interfaces/IHttpContext";

type ExistsRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
    // eslint-disable-next-line no-unused-vars
    callback?: (builder: IEloquent, context: IHttpContext) => IEloquent | null;
}

class ExistsRule extends AbstractDatabaseRule<ExistsRuleOptions> implements IRule {

    protected name: string = 'exists';

    protected errorTemplate: string = 'The :attribute field must exist.';

    constructor(modelConstructor: ModelConstructor, column: string, callback?: ExistsRuleOptions['callback']) {
        super(modelConstructor, { column, callback });
    }

    public async test(): Promise<boolean> {
        if (this.dataUndefinedOrNull()) {
            this.errorMessage = 'The :attribute field is required.'
            return false;
        }

        const column = db().getAdapter().normalizeColumn(this.options.column)
        let builder = this.query()
            .where(column, this.getData() as TWhereClauseValue)

        if (typeof this.options.callback === 'function') {
            const builderCustom = this.options.callback(builder.clone(), this.getHttpContext())

            if (builderCustom) {
                builder = builderCustom.clone()
            }
        }

        return await builder.count() > 0;
    }

}

export default ExistsRule; 