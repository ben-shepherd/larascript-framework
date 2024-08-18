import Joi, { ValidationOptions } from "joi";
import IValidator from "@src/core/domains/validator/interfaces/IValidator";
import IValidatorResult from "@src/core/domains/validator/interfaces/IValidatorResult";

abstract class BaseValidator implements IValidator
{
    protected schema?: Joi.ObjectSchema;

    setRules(rules: Joi.ObjectSchema): this
    {
        this.schema = rules;
        return this
    }

    rules(): Joi.ObjectSchema
    {
        return this.schema ?? Joi.object({});
    }

    validate<T>(payload: Record<string, unknown>, options?: ValidationOptions): IValidatorResult<T> {
        const result = this.rules().validate(payload, options)

        return {
            success: !result.error,
            joi: result
        }
    }
}

export default BaseValidator