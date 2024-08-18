import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import Joi, { ObjectSchema } from "joi";

class CreateUserValidator extends BaseValidator
{
    rules(): ObjectSchema {
        return Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
        })
    }
}

export default CreateUserValidator