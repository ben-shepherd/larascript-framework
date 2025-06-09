import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type Options = {

    /** The date to compare against. If not provided, defaults to current date */
    date?: Date

    /** The name of another attribute to compare against instead of the current value */
    attribute?: string
}

class AfterDateRule extends AbstractRule implements IRule {

    protected name: string = 'enum'

    protected errorTemplate: string = 'The :attribute must be after :date.';

    protected options!: Options & { date: Date }

    protected beforeDate!: Date

    constructor(options: Options) {
        super()
        this.options = {
            date: new Date(),
            ...(options ?? {}),
        }
    }

    public async test(): Promise<boolean> {
        if (this.nullableString()) return true
        if (this.dataUndefinedOrNull()) return false

        try {
            this.beforeDate = this.parseDataAsDate()
            let afterDate: Date = this.options.date

            if (typeof this.options.attribute === 'string') {
                afterDate = this.parseOtherAttributeDate()
            }

            return this.beforeDate > afterDate
        }

        catch (err) {
            this.errorMessage = (err as Error).message
        }

        return false
    }

    /**
     * Parses the input data as a Date object
     */
    protected parseDataAsDate(): Date {
        try {
            let value = this.getData() as string | Date | unknown;

            if (typeof value === 'string') {
                value = this.fromString(value)
            }
            if (!(value instanceof Date)) {
                throw Error('Invalid value type')
            }

            return value
        }
        catch (err) {
            this.errorMessage = 'Expected the :attribute value to be a string (YYYY-MM-DD) or a Date'
            throw err
        }
    }

    /**
     * Parses a date from another attribute specified in the options
     */
    protected parseOtherAttributeDate(): Date {
        const attribute = this.options.attribute as string

        try {
            let value = this.getAttributes()?.[attribute as string] as string | Date | unknown;

            if (typeof value === 'string') {
                value = this.fromString(value)
            }
            if (!(value instanceof Date)) {
                throw Error('Invalid value type')
            }

            return value
        }
        catch (err) {
            this.errorMessage = `Expected the ${attribute} value to be a string (YYYY-MM-DD) or a Date`
            throw err
        }
    }


    /**
     * Converts a string in YYYY-MM-DD format to a Date object
     */
    protected fromString(value: string) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    date: this.beforeDate.toLocaleDateString('en-GB', {
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
