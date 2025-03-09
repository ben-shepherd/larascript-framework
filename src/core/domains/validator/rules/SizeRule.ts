import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

type TSizeOptions = {
    size: number
}

class SizeRule extends AbstractRule<TSizeOptions> implements IRule {

    protected name: string = 'size'

    protected errorTemplate: string = '';

    protected errorTemplateNumber = 'The :attribute field must be :size.';

    protected errorTemplateString = 'The :attribute field must be :size characters.';

    protected errorTemplateArray = 'The :attribute field must contain :size items.';

    constructor(size: TSizeOptions['size']) {
        super({ size })
    }

    public async test(): Promise<boolean> {
        this.errorTemplate = this.defaultError
        
        if(this.dataUndefinedOrNull()) return false

        if(!this.testNumber()) return false
        if(!this.testString()) return false
        if(!this.testArray()) return false

        return true
    }


    protected testNumber(): boolean {
        if(typeof this.getData() === 'number') {
            if(this.getData() as number !== this.options.size) {
                this.errorTemplate = this.errorTemplateNumber
                return false
            }
        }
        return true
    }

    protected testString(): boolean {
        if(typeof this.getData() === 'string') {
            if((this.getData() as string).length !== this.options.size) {
                this.errorTemplate = this.errorTemplateString
                return false
            }
        }
        return true
    }

    protected testArray(): boolean {
        if(Array.isArray(this.getData())) {
            if((this.getData() as any[]).length !== this.options.size) {
                this.errorTemplate = this.errorTemplateArray
                return false
            }
        }
        return true
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    size: this.options.size
                })
            ]
        }
    }

}

export default SizeRule; 