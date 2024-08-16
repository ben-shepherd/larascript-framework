import Joi from "joi";
import IValidatorResult from "./IValidatorResult";

interface IValidator
{
    validate(payload: Record<string, unknown>): IValidatorResult;

    rules(): Joi.ObjectSchema;
}

export default IValidator