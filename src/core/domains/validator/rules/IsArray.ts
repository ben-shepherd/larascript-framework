
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsArray extends AbstractRule implements IRule {

    protected name: string = 'array'

    protected errorTemplate: string = 'The :attribute field must be an array.';

    public validate(): boolean {
        return Array.isArray(this.getData())
    }

    public getError(): IRuleError {
        return {
            [this.field]: this.buildError()
        }
    }


}


export default IsArray;
