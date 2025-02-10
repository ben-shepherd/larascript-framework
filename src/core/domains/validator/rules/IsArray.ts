
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class IsArray extends AbstractRule implements IRule {

    protected name: string = 'array'

    protected errorTemplate: string = 'The :attribute field must be an array.';

    public async test(): Promise<boolean> {
        return Array.isArray(this.getData())
    }

}


export default IsArray;
