import Joi from "joi";
import BaseValidator from "./BaseValidator";

class Validator extends BaseValidator {
    constructor(rules: Joi.ObjectSchema = Joi.object({})) {
        super()

        if (rules) {
            this.setRules(rules)
        }
    }
}

export default Validator