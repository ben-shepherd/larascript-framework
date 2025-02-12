
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

class IsNumber extends AbstractRule implements IRule {

    protected name: string = 'number'

    protected errorTemplate: string = 'The :attribute field must be a number.';

    protected testArrayItems: boolean = true

    public async test(): Promise<boolean> {
        return typeof this.getData() === 'number'
    }

}


export default IsNumber;
