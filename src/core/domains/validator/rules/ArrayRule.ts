
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class ArrayRule extends AbstractRule implements IRule {

    protected name: string = 'is_array'

    protected errorTemplate: string = 'The :attribute field must be an array.';

    public async test(): Promise<boolean> {
        return Array.isArray(this.getData())
    }

}


export default ArrayRule;
