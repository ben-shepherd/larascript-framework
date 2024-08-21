import IValidatorResult from "@src/core/domains/validator/interfaces/IValidatorResult";
import Joi, { ValidationOptions } from "joi";

export type IInterfaceCtor = new (...args: any[]) => IValidator;

export type IValidatorPayload = Record<string, unknown>;

interface IValidator<T = any>
{
    validate(payload: Record<string, unknown>, options?: ValidationOptions): Promise<IValidatorResult<T>>;

    rules(): Joi.ObjectSchema<T>;

    setRules(rules: Joi.ObjectSchema): IValidator<T>;

    setErrorMessage(customMessages: Record<string, string>): IValidator<T>;
}

export default IValidator