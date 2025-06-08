import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

type Options = {
    values: string[];
    caseInsensitive?: boolean;
}

class EnumRule extends AbstractRule implements IRule {

    protected name: string = 'enum'

    protected errorTemplate: string = 'The :attribute format is invalid.';

    protected options: Options = {
        values: [],
        caseInsensitive: false,
    }

    constructor(options: Options) {
        super()
        this.options = options
    }

    public async test(): Promise<boolean> {
        if (this.nullableString()) return true
        if (this.dataUndefinedOrNull()) return false

        const value = this.getData()
        const optionsWithDefaults: Options = {
            caseInsensitive: false,
            ...this.options,
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            return false;
        }

        if (optionsWithDefaults.caseInsensitive && typeof value === 'string') {
            return this.options.values.map((s) => s.toLowerCase()).includes(value.toLowerCase());
        }

        return this.options.values.includes(value.toString());
    }

}


export default EnumRule;
