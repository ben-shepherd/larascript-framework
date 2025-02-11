import ValidatorException from "../exceptions/ValidatorException";
import { IRulesObject } from "../interfaces/IRule";
import { IValidator, IValidatorAttributes, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";
import Validator from "../service/Validator";

/**
 * Abstract base class for creating custom validators with type-safe validation rules and error messages.
 * Extend this class to create specific validators for different data structures.
 * 
 * @template Attributes - Interface describing the shape of validated data
 */
abstract class BaseCustomValidator<Attributes extends IValidatorAttributes = IValidatorAttributes> implements IValidator {

    protected abstract rules: IRulesObject

    protected messages: IValidatorMessages = {}
    
    protected result: IValidatorResult<Attributes> | undefined

    private validator: IValidator | undefined;

    /**
     * Validates the provided data against the defined rules.
     * 
     * @param data - Object containing the data to validate
     * @returns Promise resolving to validation result
     * @throws Error if validation fails unexpectedly
     */
    public async validate(data: Attributes): Promise<IValidatorResult<Attributes>> {
        this.validator = Validator.make(this.rules, this.messages)
        this.result = await this.validator.validate(data) as IValidatorResult<Attributes>
        return this.result
    }

    /**
     * Checks if the validation passed.
     * 
     * @returns true if validation passed, false otherwise
     * @throws Error if validate() hasn't been called yet
     */
    public passes(): boolean {
        if(!this.result) {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return this.result.passes()
    }
    
    /**
     * Returns validation error messages if validation failed.
     * 
     * @returns Object with field names as keys and array of error messages as values
     * @throws Error if validate() hasn't been called yet
     */
    public errors(): Record<string, string[]> {
        if(!this.result) {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return this.result.errors()
    }

    /**
     * Returns the validated data with proper typing.
     * Only call this method if validation passed.
     * 
     * @returns Object containing the validated data with proper types
     * @throws Error if validate() hasn't been called yet
     */
    public validated(): Attributes {
        if(!this.result) {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return this.result.validated()
    }

}

export default BaseCustomValidator