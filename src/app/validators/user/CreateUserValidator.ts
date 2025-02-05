import { auth } from "@src/core/domains/auth-legacy/services/JwtAuthService";
import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import { ValidatorPayload } from "@src/core/domains/validator/interfaces/IValidator";
import Joi, { ObjectSchema } from "joi";

class CreateUserValidator extends BaseValidator {

    public customValidatorMethods = [
        'validateEmailAvailability'
    ]

    /**
     * Validate if the email is available
     * @param payload 
     */
    async validateEmailAvailability(payload: ValidatorPayload) {
        
        const repository = auth().getUserRepository();
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

export default CreateUserValidator