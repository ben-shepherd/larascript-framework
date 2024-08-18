import Joi, { ValidationOptions } from "joi";
import IValidatorResult from "@src/core/domains/validator/interfaces/IValidatorResult";

export type IInterfaceCtor = new (...args: any[]) => IValidator;

interface IValidator<T = any>
{
    validate(payload: Record<string, unknown>, options?: ValidationOptions): IValidatorResult<T>;

    rules(): Joi.ObjectSchema<T>;

    setRules(rules: Joi.ObjectSchema): IValidator<T>;
}

export default IValidator