import Joi from "joi";
import IValidator from "../interfaces/IValidator";
import IValidatorResult from "../interfaces/IValidatorResult";

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

    validate<T>(payload: Record<string, unknown>): IValidatorResult<T> {
        const result = this.rules().validate(payload)

        return {
            success: !result.error,
            joi: result
        }
    }
}

export default BaseValidator