import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import { IValidatorPayload } from "@src/core/domains/validator/interfaces/IValidator";
import { App } from "@src/core/services/App";
import Joi, { ObjectSchema } from "joi";

class TestCreateUserValidator extends BaseValidator {

    public customValidatorMethods = [
        'validateEmailAvailability'
    ]

    /**
     * Validate if the email is available
     * @param payload 
     */
    async validateEmailAvailability(payload: IValidatorPayload) {
        const repository = App.container('auth').userRepository;
        
        const user = await repository.findOneByEmail(payload.email as string);

        if(user) {
            this.setErrorMessage({ email: 'User already exists' });
        }
    }

    rules(): ObjectSchema {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
            firstName: Joi.string(),
            lastName: Joi.string(),
        })
    }

}

export default TestCreateUserValidator