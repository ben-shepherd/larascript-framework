
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class StringRule extends AbstractRule implements IRule {

    protected name: string = 'is_string'

    protected errorTemplate: string = 'The :attribute field must be a string.';
 
    public async test(): Promise<boolean> {

        if(Array.isArray(this.getData())) {
            return (this.getData() as unknown[]).every(item => typeof item === 'string')
        }

        return typeof this.getData() === 'string'

    }

}


export default StringRule;
