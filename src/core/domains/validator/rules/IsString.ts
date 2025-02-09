
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsString extends AbstractRule implements IRule {

    protected name: string = 'string'

    protected errorTemplate: string = 'The :attribute field must be a string.';

    public test(): boolean {
        return typeof this.getData() === 'string'
    }

    public getError(): IRuleError {
        return {
            [this.getPath()]: this.buildError()
        }
    }

}


export default IsString;
