import Joi from "joi";
import Validator from "@src/core/domains/validator/base/Validator";
import IValidator from "@src/core/domains/validator/interfaces/IValidator";
import IValidatorService from "@src/core/domains/validator/interfaces/IValidatorService";
import { validateMiddleware } from "@src/core/domains/validator/middleware/validateMiddleware";

class ValidatorService implements IValidatorService
{
    public validator(rules: Joi.ObjectSchema): IValidator
    {
        return new Validator(rules);
    }

    public middleware()
    {
        return validateMiddleware;
    }
}

export default ValidatorService;