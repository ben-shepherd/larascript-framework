
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class IsBoolean extends AbstractRule implements IRule {

    protected name: string = 'boolean'

    protected errorTemplate: string = 'The :attribute field must be a boolean.';

    public async test(): Promise<boolean> {
        return typeof this.getData() === 'boolean'
    }

}


export default IsBoolean;
