
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";
import isTruthy from "../utils/isTruthy";

class Accepted extends AbstractRule implements IRule {

    protected name: string = 'accepted'

    protected errorTemplate: string = 'The :attribute field must be accepted.';

    public async test(): Promise<boolean> {
        return isTruthy(this.getData())
    }

}


export default Accepted;
