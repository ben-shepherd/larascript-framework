
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsString extends AbstractRule implements IRule {

    protected name: string = 'object'

    protected errorTemplate: string = 'The :attribute field must be an object.';

    public validate(): boolean {
        return typeof this.getData() === 'object'
    }

    public getError(): IRuleError {
        return {
            [this.field]: this.buildError()
        }
    }

}


export default IsString;
