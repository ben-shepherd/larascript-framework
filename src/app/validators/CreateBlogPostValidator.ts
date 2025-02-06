import BaseValidator from "@src/core/domains/validator-legacy/base/BaseValidator";
import Joi, { ObjectSchema } from "joi";

class CreateBlogPostValidator extends BaseValidator {

    protected additionalMethodsToValidate: string[] = [];
    
    rules(): ObjectSchema {
        return Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
        })
    }

}

export default CreateBlogPostValidator