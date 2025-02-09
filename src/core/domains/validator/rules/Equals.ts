
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class Equals extends AbstractRule implements IRule {

    protected name: string = 'equals'

    protected errorTemplate: string = 'The :attribute field must be equal to :matches.';

    protected matches: unknown;

    constructor(matches: unknown) {
        super();
        this.matches = matches;
    }

    public validate(): boolean {
        return this.getData() === this.matches
    }


    public getError(): IRuleError {
        return {
            [this.field]: this.buildError({
                matches: this.matches
            })
        }
    }

}


export default Equals;
