
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

class StringRule extends AbstractRule implements IRule {

    protected name: string = 'string'

    protected errorTemplate: string = 'The :attribute field must be a string.';

    public async test(): Promise<boolean> {

        if(Array.isArray(this.getAttributeData())) {
            return (this.getAttributeData() as unknown[]).every(item => typeof item === 'string')
        }

        return typeof this.getAttributeData() === 'string'

    }

}


export default StringRule;
