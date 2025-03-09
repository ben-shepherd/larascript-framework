import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";
import { isUuid } from "@src/core/utility/uuid";

class UuidRule extends AbstractRule<{}> implements IRule {

    protected name: string = 'uuid';

    protected errorTemplate: string = 'The :attribute field must be a valid UUID.';

    constructor() {
        super();
        this.options = {};
    }

    public async test(): Promise<boolean> {
        return isUuid(this.getData());
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({})
            ]
        };
    }

}

export default UuidRule; 