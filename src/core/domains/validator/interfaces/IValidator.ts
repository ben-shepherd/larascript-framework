/* eslint-disable no-unused-vars */
import IValidatorResult from "@src/core/domains/validator/interfaces/IValidatorResult";
import Joi, { ValidationOptions } from "joi";

export type IInterfaceCtor = new (...args: any[]) => IValidator;

export type IValidatorPayload = Record<string, unknown>;

/**
 * Interface for a validator class.
 * @template T The type of the payload being validated.
 */
interface IValidator<T = any>
{

    /**
     * Validates the given payload.
     * @param payload The payload to validate.
     * @param options The Joi validation options.
     * @returns A promise that resolves to an IValidatorResult.
     */
    validate(payload: Record<string, unknown>, options?: ValidationOptions): Promise<IValidatorResult<T>>;

    /**
     * Gets the validation rules.
     * @returns The validation rules as a Joi ObjectSchema.
     */
    rules(): Joi.ObjectSchema<T>;

    /**
     * Sets the validation rules.
     * @param rules The validation rules as a Joi ObjectSchema.
     * @returns The validator instance.
     */
    setRules(rules: Joi.ObjectSchema): IValidator<T>;

    /**
     * Sets custom validation messages.
     * @param customMessages The custom validation messages as a record of strings.
     * @returns The validator instance.
     */
    setErrorMessage(customMessages: Record<string, string>): IValidator<T>;

    /**
     * Gets the Joi validation options
     * @returns The Joi validation options
     */
    getJoiOptions(): ValidationOptions;
}

export default IValidator
