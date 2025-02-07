
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";
import isTruthy from "../utils/isTruthy";

type AcceptedIfOptions = {
    anotherField: string,
    value: unknown
}


class AcceptedIf extends AbstractRule<AcceptedIfOptions> implements IRule {

    protected name: string = 'accepted_if'

    protected errorTemplate: string = 'The :attribute field must be accepted when :another is :value.';


    constructor(anotherField: string, value: unknown) {
        super()
        this.options.anotherField = anotherField
        this.options.value = value
    }

    public validate(): boolean {
        const {
            anotherField,
            value: expectedValue

        } = this.options

        const mainFieldValue = this.getAttribute(this.field)
        const otherFieldValue = this.getAttribute(anotherField)

        if (otherFieldValue !== expectedValue) {
            return true
        }

        return isTruthy(mainFieldValue)
    }


    getError(): IRuleError {
        return {
            [this.field]: this.buildError({
                another: this.options.anotherField,
                value: this.options.value
            })
        }
    }



}

export default AcceptedIf;
