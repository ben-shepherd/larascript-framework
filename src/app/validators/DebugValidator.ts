import BaseValidator from "@src/core/domains/validator-legacy/base/BaseValidator";
import Joi, { ObjectSchema } from "joi";

class DebugValidator extends BaseValidator {

    protected additionalMethodsToValidate: string[] = [];

    getJoiOptions(): Joi.ValidationOptions {
        return {
            stripUnknown: true,
            abortEarly: false,
            allowUnknown: false,
            presence: 'required',
        }
    }
    
    rules(): ObjectSchema {
        return Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
        })
    }

}

export default DebugValidator