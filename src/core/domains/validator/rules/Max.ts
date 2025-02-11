import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

type TMaxOptions = {
    max: number
}

class Max extends AbstractRule<TMaxOptions> implements IRule {

    protected name: string = 'max'

    protected errorTemplate: string = '';

    protected errorTemplateNumber = 'The :attribute field must not be greater than :max.';

    protected errorTemplateString = 'The :attribute field must not be greater than :max characters.';

    protected errorTemplateArray = 'The :attribute field must not have more than :max items.';

    constructor(max: TMaxOptions['max']) {
        super()
        this.options = {
            max
        }
    }

    public async test(): Promise<boolean> {
        this.errorTemplate = this.defaultError
        
        if(this.testFailsWhenUndefinedOrNullable()) return false

        if(!this.testNumber()) return false
        if(!this.testString()) return false
        if(!this.testArray()) return false

        return true
    }

    protected testFailsWhenUndefinedOrNullable(): boolean {
        if(this.getData() === undefined || this.getData() === null) {
            return true
        }
        return false
    }

    protected testNumber(): boolean {
        if(typeof this.getData() === 'number') {
            if(this.getData() as number > this.options.max) {
                this.errorTemplate = this.errorTemplateNumber
                return false
            }
        }
        return true
    }

    protected testString(): boolean {
        if(typeof this.getData() === 'string') {
            if((this.getData() as string).length > this.options.max) {
                this.errorTemplate = this.errorTemplateString
                return false
            }
        }
        return true
    }

    protected testArray(): boolean {
        if(Array.isArray(this.getData())) {
            if((this.getData() as any[]).length > this.options.max) {
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
                    max: this.options.max
                })
            ]
        }
    }

}


export default Max;
