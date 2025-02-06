import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

type AcceptedIfOptions = {
    field: string,
    anotherField: string,
    value: unknown
}

class AcceptedIf extends AbstractRule<AcceptedIfOptions> implements IRule {

    constructor(field: string, anotherField: string, value: unknown) {
        super()
        this.options.field = field
        this.options.anotherField = anotherField
        this.options.value = value
    }


    public validate(): boolean {
        const {
            field,
            anotherField,
            value: expectedValue
        } = this.options

        const mainFieldValue = this.getAttribute(field)
        const otherFieldValue = this.getAttribute(anotherField)

        if (otherFieldValue !== expectedValue) {
            return true
        }

        const acceptedValues = ['yes', 'on', 1, '1', true, 'true']
        return acceptedValues.includes(mainFieldValue as string | number | boolean)
    }

}

export default AcceptedIf;
