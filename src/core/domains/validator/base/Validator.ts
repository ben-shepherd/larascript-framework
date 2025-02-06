import BaseValidator from "@src/core/domains/validator/base/BaseValidator";
import Joi from "joi";

/**
 * A class that extends the BaseValidator. This class is used to validate objects.
 *
 * The rules() method must be implemented and return a Joi ObjectSchema.
 */
class Validator extends BaseValidator {

    protected additionalMethodsToValidate: string[] = [];

    constructor(rules: Joi.ObjectSchema = Joi.object({})) {
        super()

        if (rules) {
            this.setRules(rules)
        }
    }

}

export default Validator