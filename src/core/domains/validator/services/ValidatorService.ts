import Joi from "joi";
import Validator from "../base/Validator";
import IValidator from "../interfaces/IValidator";
import IValidatorService from "../interfaces/IValidatorService";
import { validateMiddleware } from "../middleware/validateMiddleware";

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