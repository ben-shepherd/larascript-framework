
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

class HasFileRule extends AbstractRule implements IRule {

    protected name: string = 'required'

    protected errorTemplate: string = 'The :attribute field must be a file.';

    public async test(): Promise<boolean> {
        const files = this.getHttpContext().getFiles(this.getAttribute())
        const tests = files?.some(file => typeof file !== 'undefined') ?? false

        return tests
    }
    
}


export default HasFileRule;
