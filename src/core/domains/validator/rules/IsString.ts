
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsString extends AbstractRule implements IRule {

    protected name: string = 'string'

    protected errorTemplate: string = 'The :attribute field must be a string.';

    public validate(): boolean {
        const value = this.getAttribute(this.field)
        return typeof value === 'string'
    }

    public getError(): IRuleError {
        return {
            [this.field]: this.buildError()
        }
    }


}


export default IsString;
