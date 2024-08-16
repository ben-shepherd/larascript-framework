import Joi from "joi";
import IValidator from "../interfaces/IValidator";
import IValidatorResult from "../interfaces/IValidatorResult";

abstract class Validator implements IValidator
{
    rules()
    {
        return Joi.object()
    }

    validate<T>(payload: Record<string, unknown>): IValidatorResult<T> {
        const result = this.rules().validate(payload)

        return {
            success: !result.error,
            joi: result
        }
    }
}

export default Validator