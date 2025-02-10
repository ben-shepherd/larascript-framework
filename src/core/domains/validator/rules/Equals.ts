
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class Equals extends AbstractRule implements IRule {

    protected name: string = 'equals'

    protected errorTemplate: string = 'The :attribute field must be equal to :matches.';

    protected matches: unknown;

    constructor(matches: unknown) {
        super();
        this.matches = matches;
    }

    public async test(): Promise<boolean> {
        return this.getData() === this.matches
    }

}


export default Equals;
