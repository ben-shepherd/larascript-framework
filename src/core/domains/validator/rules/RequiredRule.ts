
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

class RequiredRule extends AbstractRule implements IRule {

    protected name: string = 'required'

    protected errorTemplate: string = 'The :attribute field is required.';

    public async test(): Promise<boolean> {
        if(this.dataUndefinedOrNull()) return false

        if(typeof this.getData() === 'string') {
            return this.getData() !== ''
        }

        if(Array.isArray(this.getData())) {
            return (this.getData() as unknown[]).length > 0
        }
        
        if(typeof this.getData() === 'object') {
            return Object.keys(this.getData() as Record<string, unknown>).length > 0
        }

        return true
    }
    
}


export default RequiredRule;
