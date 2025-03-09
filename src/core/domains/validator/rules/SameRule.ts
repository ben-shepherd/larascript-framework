import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type TSameOptions = {
    otherField: string
}

class SameRule extends AbstractRule<TSameOptions> implements IRule {

    protected name: string = 'same';

    protected errorTemplate: string = 'The :attribute field must match :otherField.';

    constructor(otherField: TSameOptions['otherField']) {
        super({ otherField })
    }

    public async test(): Promise<boolean> {
        if(this.dataUndefinedOrNull()) return false

        const otherValue = this.getAttributes()?.[this.options.otherField];
        return this.getData() === otherValue;
    }


    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    otherField: this.options.otherField
                })
            ]
        }
    }

}

export default SameRule; 