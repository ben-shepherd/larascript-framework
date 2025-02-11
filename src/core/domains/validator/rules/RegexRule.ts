import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

type TRegexOptions = {
    pattern: RegExp
}

class RegexRule extends AbstractRule<TRegexOptions> implements IRule {

    protected name: string = 'regex';

    protected errorTemplate: string = 'The :attribute field format is invalid.';

    constructor(pattern: string | RegExp) {
        super();
        this.options = {
            pattern: pattern instanceof RegExp ? pattern : new RegExp(pattern)
        };
    }

    public async test(): Promise<boolean> {
        if (this.getData() === undefined || this.getData() === null) {
            return false;
        }

        const value = String(this.getData());
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