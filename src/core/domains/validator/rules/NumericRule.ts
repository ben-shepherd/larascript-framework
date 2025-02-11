import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

class NumericRule extends AbstractRule<{}> implements IRule {

    protected name: string = 'numeric';

    protected errorTemplate: string = 'The :attribute field must be numeric.';

    constructor() {
        super();
        this.options = {};
    }

    public async test(): Promise<boolean> {
        if(this.dataUndefinedOrNull()) return false

        // Allow both numbers and numeric strings
        if (typeof this.getData() === 'number') {
            return !isNaN(this.getData() as number);
        }

        if (typeof this.getData() === 'string') {
            // Check if string is numeric (including decimals and negative numbers)
            return /^-?\d*\.?\d+$/.test(this.getData() as string);
        }

        return false;
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({})
            ]
        };
    }

}

export default NumericRule; 