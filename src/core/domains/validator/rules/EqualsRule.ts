
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

class EqualsRule extends AbstractRule implements IRule {

    protected name: string = 'equals'

    protected errorTemplate: string = 'The :attribute field must be equal to :matches.';

    protected matches: unknown;

    constructor(matches: unknown) {
        super({ matches });
    }

    public async test(): Promise<boolean> {
        return this.getData() === this.matches
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    matches: this.matches
                })
            ]
        }
    }

}


export default EqualsRule;
