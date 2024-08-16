import Joi from "joi";
import IValidatorResult from "./IValidatorResult";

interface IValidator
{
    validate(payload: Record<string, unknown>, schema: Joi.ObjectSchema): IValidatorResult;
}

export default IValidator