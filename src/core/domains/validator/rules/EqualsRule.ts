
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type TEqualsOptions = {
    matches: unknown
}

class EqualsRule extends AbstractRule<TEqualsOptions> implements IRule {

    protected name: string = 'equals'

    protected errorTemplate: string = 'The :attribute field must be equal to :matches.';

    constructor(matches: unknown) {
        super({ matches });
    }

    public async test(): Promise<boolean> {
        return this.getAttributeData() === this.options.matches
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    matches: this.options.matches
                })
            ]
        }
    }

}


export default EqualsRule;
