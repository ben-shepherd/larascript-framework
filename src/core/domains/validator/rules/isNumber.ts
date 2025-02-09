
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class IsNumber extends AbstractRule implements IRule {

    protected name: string = 'number'

    protected errorTemplate: string = 'The :attribute field must be a number.';

    public test(): boolean {
        return typeof this.getData() === 'number'
    }

    public getError(): IRuleError {
        return {
            [this.getPath()]: this.buildError()
        }
    }

}


export default IsNumber;
