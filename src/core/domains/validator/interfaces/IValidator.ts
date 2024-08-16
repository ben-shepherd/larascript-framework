import Joi from "joi";
import IValidatorResult from "./IValidatorResult";

interface IValidator<T = any>
{
    validate(payload: Record<string, unknown>): IValidatorResult<T>;

    rules(): Joi.ObjectSchema<T>;

    setRules(rules: Joi.ObjectSchema): IValidator<T>;
}

export default IValidator