
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class isObject extends AbstractRule implements IRule {

    protected name: string = 'object'

    protected errorTemplate: string = 'The :attribute field must be an object.';

    public async test(): Promise<boolean> {
        return typeof this.getData() === 'object'
    }

}


export default isObject;
