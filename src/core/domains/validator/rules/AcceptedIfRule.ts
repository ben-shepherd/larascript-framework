
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";
import isTruthy from "@src/core/domains/validator/utils/isTruthy";

type AcceptedIfOptions = {
    anotherField: string,
    value: unknown
}


class AcceptedIfRule extends AbstractRule<AcceptedIfOptions> implements IRule {

    protected name: string = 'accepted_if'

    protected errorTemplate: string = 'The :attribute field must be accepted when :another is :value.';

    constructor(anotherField: string, value: unknown) {
        super()
        this.options.anotherField = anotherField
        this.options.value = value
    }

    public async test(): Promise<boolean> {
        const {
            anotherField,
            value: expectedValue

        } = this.options

        const mainFieldValue = this.getData()
        const otherFieldValue = this.getAttributes()?.[anotherField]

        if (otherFieldValue !== expectedValue) {
            return true
        }

        return isTruthy(mainFieldValue)
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    another: this.options.anotherField,
                    value: this.options.value
                })
            ]
        }
    }

}

export default AcceptedIfRule;
