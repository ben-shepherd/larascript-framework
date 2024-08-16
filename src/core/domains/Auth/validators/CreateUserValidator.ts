import Joi, { ObjectSchema } from "joi";
import BaseValidator from "../../validator/base/BaseValidator";

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