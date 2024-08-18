import Joi from "joi";
import BaseValidator from "@src/core/domains/validator/base/BaseValidator";

class Validator extends BaseValidator {
    constructor(rules: Joi.ObjectSchema = Joi.object({})) {
        super()

        if (rules) {
            this.setRules(rules)
        }
    }
}

export default Validator