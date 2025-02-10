
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsArray extends AbstractRule implements IRule {

    protected name: string = 'array'

    protected errorTemplate: string = 'The :attribute field must be an array.';

    protected testArrayItems = false

    public async test(): Promise<boolean> {
        return Array.isArray(this.getData())
    }

    public getError(): IRuleError {
        return {
            [this.getPath()]: this.buildError()
        }
    }


}


export default IsArray;
