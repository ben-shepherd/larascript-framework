
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

class ArrayRule extends AbstractRule implements IRule {

    protected name: string = 'array'

    protected errorTemplate: string = 'The :attribute field must be an array.';

    public async test(): Promise<boolean> {
        return Array.isArray(this.getAttributeData())
    }

}


export default ArrayRule;
