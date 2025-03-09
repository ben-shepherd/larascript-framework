import { TWhereClauseValue } from "@src/core/domains/eloquent/interfaces/IEloquent";
import { ModelConstructor } from "@src/core/domains/models/interfaces/IModel";
import AbstractDatabaseRule from "@src/core/domains/validator/abstract/AbstractDatabaseRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

type UniqueRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
}

class UniqueRule extends AbstractDatabaseRule<UniqueRuleOptions> implements IRule {

    protected name: string = 'unique';

    protected errorTemplate: string = 'The :attribute field must be unique.';

    constructor(modelConstructor: ModelConstructor, column: string) {
        super(modelConstructor, { column });
    }

    public async test(): Promise<boolean> {
        
        if(this.dataUndefinedOrNull()) {
            this.errorMessage = 'The :attribute field is required.'
            return false;
        }
        
        return await this.query()
            .where(this.options.column, this.getData() as TWhereClauseValue)
            .count() === 0;
    }

}

export default UniqueRule; 