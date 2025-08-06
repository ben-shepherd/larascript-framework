import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

class NumericRule extends AbstractRule<{}> implements IRule {

    protected name: string = 'numeric';

    protected errorTemplate: string = 'The :attribute field must be numeric.';
    
    public async test(): Promise<boolean> {
        if(this.dataUndefinedOrNull()) return false

        // Allow both numbers and numeric strings
        if (typeof this.getAttributeData() === 'number') {
            return !isNaN(this.getAttributeData() as number);
        }

        if (typeof this.getAttributeData() === 'string') {
            // Check if string is numeric (including decimals and negative numbers)
            return /^-?\d*\.?\d+$/.test(this.getAttributeData() as string);
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