import User from "@src/app/models/auth/User";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import { ValidatorPayload } from "@src/core/domains/validator/interfaces/IValidator";
import Joi, { ObjectSchema } from "joi";

class CreateUserValidator extends BaseValidator {

    protected additionalMethodsToValidate: string[] = [
        'validateEmailAvailability'
    ]

    /**
     * Validate if the email is available
     * @param payload 
     */
    async validateEmailAvailability(payload: ValidatorPayload) {
        
        const user = await queryBuilder(User).where('email', payload.email as string).first();

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