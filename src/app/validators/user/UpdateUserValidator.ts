import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import Joi, { ObjectSchema } from "joi";

class UpdateUserValidator extends BaseValidator {

    protected additionalMethodsToValidate: string[] = [];

    rules(): ObjectSchema {
        return Joi.object({
            password: Joi.string().min(6),
            firstName: Joi.string(),
            lastName: Joi.string(),
        })
    }

}

export default UpdateUserValidator