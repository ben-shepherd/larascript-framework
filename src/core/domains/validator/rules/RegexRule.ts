import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type TRegexOptions = {
    pattern: RegExp
}

class RegexRule extends AbstractRule<TRegexOptions> implements IRule {

    protected name: string = 'regex';

    protected errorTemplate: string = 'The :attribute field format is invalid.';

    constructor(pattern: string | RegExp) {
        super({ pattern: pattern instanceof RegExp ? pattern : new RegExp(pattern) });
    }

    public async test(): Promise<boolean> {
        if (this.dataUndefinedOrNull()) return false
        if (this.nullableString()) return true

        const value = String(this.getAttributeData());
        return this.options.pattern.test(value);
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage()
            ]
        };
    }

}

export default RegexRule; 