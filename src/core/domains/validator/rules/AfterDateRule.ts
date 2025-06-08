import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type Options = {
    date: Date
}

class AfterDateRule extends AbstractRule implements IRule {

    protected name: string = 'enum'

    protected errorTemplate: string = 'The :attribute must be after :date.';

    protected options!: Options

    constructor(options: Options) {
        super()
        this.options = options
    }

    public async test(): Promise<boolean> {
        if (this.nullableString()) return true
        if (this.dataUndefinedOrNull()) return false

        let value = this.getData() as string | Date | unknown;

        try {
            if (typeof value === 'string') {
                value = this.fromString(value)
            }
            if (!(value instanceof Date)) {
                return false
            }

            return value > this.options.date
        }
        // eslint-disable-next-line no-unused-vars
        catch (err) { }

        return false
    }

    protected fromString(value: string) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    date: this.options.date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                })
            ]
        }
    }

}


export default AfterDateRule;
