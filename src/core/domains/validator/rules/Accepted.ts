
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";
import isTruthy from "../utils/isTruthy";

class Accepted extends AbstractRule implements IRule {

    protected name: string = 'accepted'

    protected errorTemplate: string = 'The :attribute field must be accepted.';

    public test(): boolean {
        return isTruthy(this.getData())
    }

    public getError(): IRuleError {
        return {
            [this.getPath()]: this.buildError()
        }
    }


}


export default Accepted;
