import { ModelConstructor } from "@src/core/interfaces/IModel";

import { TWhereClauseValue } from "../../eloquent/interfaces/IEloquent";
import AbstractDatabaseRule from "../abstract/AbstractDatabaseRule";
import { IRule } from "../interfaces/IRule";

type UniqueRuleOptions = {
    modelConstructor: ModelConstructor;
    column: string;
}

class UniqueRule extends AbstractDatabaseRule<UniqueRuleOptions> implements IRule {

    protected name: string = 'unique';

    protected errorTemplate: string = 'The :attribute field must be unique.';

    constructor(modelConstructor: ModelConstructor, column: string) {
        super(modelConstructor);
        this.options = {
            ...(this.options ?? {}),
            column
        };
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