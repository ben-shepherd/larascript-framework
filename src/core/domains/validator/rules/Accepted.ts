
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";
import isTruthy from "../utils/isTruthy";

class Accepted extends AbstractRule implements IRule {


    protected name: string = 'accepted'

    protected errorTemplate: string = 'The :attribute field must be accepted.';


    public validate(): boolean {
        return isTruthy(this.getData())
    }



    public getError(): IRuleError {
        return {
            [this.field]: this.buildError()
        }
    }


}


export default Accepted;
