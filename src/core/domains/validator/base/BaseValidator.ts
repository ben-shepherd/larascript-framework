import IValidator, { IValidatorPayload } from "@src/core/domains/validator/interfaces/IValidator";
import IValidatorResult from "@src/core/domains/validator/interfaces/IValidatorResult";
import baseValidatorUtil from "@src/core/domains/validator/util/baseValidatorUtil";
import Joi, { ValidationOptions } from "joi";

/**
 * Base validator class
 * 
 * @abstract
 */
abstract class BaseValidator<P extends IValidatorPayload = IValidatorPayload> implements IValidator {

    /**
     * Custom validator methods
     */
    public customValidatorMethods: string[] = [];

    /**
     * Custom validation error messages
     */
    protected customErrorMessages: Record<string, string> = {};

    /**
     * Validation rules
     */
    protected schema?: Joi.ObjectSchema;


    /**
     * Validate a payload
     */
    async validate<T>(payload: P, options?: ValidationOptions): Promise<IValidatorResult<T>> {

        /**
         * Validate the payload with Joi rules
         */
        const result = this.rules().validate(payload, options)

        if(result.error) {
            return {
                success: !result.error,
                joi: result
            }
        }

        /**
         * Validate custom validator methods
         */
        return await this.validateCustomMethods<T>(payload, result)
    }

    /**
     * 
     * @param payload 
     * @param result 
     * @returns 
     */
    private async validateCustomMethods<T>(payload: P, result: Joi.ValidationResult): Promise<IValidatorResult<T>> {
        await this.runCustomValidatorMethods(payload);

        result = {
            ...result,
            error: baseValidatorUtil.formatErrors(this.customErrorMessages, result)
        }

        return {
            success: !result.error,
            joi: result
        }
    }

    /**
     * Set custom validation messages
     * @param messages 
     * @returns 
     */
    setErrorMessage (messages: Record<string, string>): this {
        this.customErrorMessages = messages;
        return this
    }

    /**
     * Set validation rules
     * @param rules 
     * @returns 
     */
    setRules(rules: Joi.ObjectSchema): this {
        this.schema = rules;
        return this
    }

    /**
     * Get validation rules
     * @returns 
     */
    rules(): Joi.ObjectSchema {
        return this.schema ?? Joi.object({});
    }

    /**
     * Run custom validator methods
     * @param payload 
     */
    private async runCustomValidatorMethods(payload: P): Promise<void> {
        for(const method of this.customValidatorMethods ) {
            await this[method](payload);
        }
    }

    /**
     * Gets the Joi validation options
     * @returns The Joi validation options
     */
    getJoiOptions(): Joi.ValidationOptions {
        return {}
    }

}

export default BaseValidator