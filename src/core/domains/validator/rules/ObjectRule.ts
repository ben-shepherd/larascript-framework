
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";

type TObjectOptions = {
    requiredProperties: string[]
}

class ObjectRule extends AbstractRule<TObjectOptions> implements IRule {

    protected name: string = 'object'

    protected errorTemplate: string = 'The :attribute field must be an object.';

    protected errorPropertiesTemplate = 'The :attribute field must contain the following properties: :properties.'

    constructor(requiredProperties: string[] = []) {
        super({ requiredProperties })
    }


    public async test(): Promise<boolean> {
        if(typeof this.getData() !== 'object') {
            return false
        }

        const hasRequiredProperties = this.validateRequiredProperties()

        if(!hasRequiredProperties) {

            this.errorMessage = this.formatErrorMessage({
                properties: this.options.requiredProperties.join(', ')
            }, this.errorPropertiesTemplate)
            
            return false
        }

        return true
    }

    protected validateRequiredProperties(): boolean {
        const data = this.getData() as unknown[]
        const requiredProperties = this.options.requiredProperties

        for(const property of requiredProperties) {
            if(typeof data[property] === 'undefined') {
                return false
            }
        }

        return true
    }

}


export default ObjectRule;
