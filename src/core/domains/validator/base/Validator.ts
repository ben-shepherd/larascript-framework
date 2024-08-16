import { ObjectSchema } from "joi";
import IValidator from "../interfaces/IValidator";
import IValidatorResult from "../interfaces/IValidatorResult";

class Validator implements IValidator
{
    validate<T>(payload: Record<string, unknown>, schema: ObjectSchema<T>): IValidatorResult<T> {
        const result = schema.validate(payload)

        return {
            success: !result.error,
            joi: result
        }
    }
}

export default Validator