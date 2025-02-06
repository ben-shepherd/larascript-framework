import Joi from "joi";

interface IValidatorResult<T = any>
{
    success: boolean;
    joi: Joi.ValidationResult<T>;
}

export default IValidatorResult