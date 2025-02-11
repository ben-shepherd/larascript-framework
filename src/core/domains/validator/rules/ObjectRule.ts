
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class ObjectRule extends AbstractRule implements IRule {

    protected name: string = 'is_object'

    protected errorTemplate: string = 'The :attribute field must be an object.';

    protected errorPropertiesTemplate = 'The :attribute field must contain the following properties: :properties.'

    protected requiredProperties: string[] = []

    constructor(requiredProperties: string[] = []) {
        super()
        this.requiredProperties = requiredProperties
    }


    public async test(): Promise<boolean> {
        if(typeof this.getData() !== 'object') {
            return false
        }

        const hasRequiredProperties = this.validateRequiredProperties()
        if(!hasRequiredProperties) {

            this.errorMessage = this.formatErrorMessage({
                properties: this.requiredProperties.join(', ')
            }, this.errorPropertiesTemplate)
            
            return false
        }

        return true
    }

    protected validateRequiredProperties(): boolean {
        const data = this.getData() as unknown[]

        for(const property of this.requiredProperties) {
            if(typeof data[property] === 'undefined') {
                return false
            }
        }

        return true
    }

}


export default ObjectRule;
