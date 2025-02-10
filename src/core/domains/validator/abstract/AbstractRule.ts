import forceString from "@src/core/util/str/forceString";

import { logger } from "../../logger/services/LoggerService";
import { IRuleError } from "../interfaces/IRule";

/**
 * Abstract base class for validation rules.
 * Provides common functionality for implementing validation rules with customizable error messages and options.
 * 
 * @template TOptions - Type of options object that can be passed to configure the rule
 */
abstract class AbstractRule<TOptions extends object = object> {

    /** Name of the validation rule */
    protected abstract name: string;

    /** Template string for error messages. Use :attribute for the field name and :key for option values */
    protected abstract errorTemplate: string;

    /** Default error message if error template processing fails */
    protected defaultError: string = 'This field is invalid.'


    /** Configuration options for the rule */
    protected options: TOptions = {} as TOptions

    /** The value to validate */
    protected data: unknown = undefined

    /** All attributes/fields being validated */
    protected attributes: unknown = undefined

    /** Dot notation path to the field being validated (e.g. "users.*.name") */
    protected path!: string;


    /**
     * Tests if the current data value passes the validation rule
     * @returns True if validation passes, false if it fails
     */
    public abstract test(): Promise<boolean>;


    /**
     * Gets the validation error details if validation fails
     * @returns Object containing error information
     */
    public abstract getError(): IRuleError;
    
    /**
     * Validates the data against the rule
     * If the last part of the path contains a wildcard (*), validates each item in the array
     * Otherwise validates the single value
     * 
     * For example:
     * - For path "users.*.name", validates name field for each user
     * - For path "email", validates single email value
     * 

     * @returns True if validation passes, false if it fails
     */
    public async validate(): Promise<boolean> {
        return await this.test()
    }

    /**
     * Validates an array of data by testing each item individually
     * @returns True if all items pass validation, false if any fail
     * @deprecated Unsure if this is needed
     */
    protected async arrayTests(): Promise<boolean> {
        const data = this.getData()

        if(Array.isArray(data)) {
            for(const item of data) {
                this.setData(item)

                if(!await this.test()) {
                    return false
                }
            }
            return true // Return true if all items passed
        }

        return false // Return false for non-array data
    }

    /**
     * Checks if the rule should be validated as an array
     * By checking if the last part of the path contains a wildcard (*)
     * @returns True if the rule should be validated as an array, false otherwise
     * @deprecated Unsure if this is needed
     */
    protected validatableAsArray(): boolean {
        return false
    }

    /**
     * Sets the configuration options for this validation rule
     * @param options - Rule-specific options object
     * @returns this - For method chaining
     */
    public setOptions(options: TOptions): this {
        this.options = options
        return this
    }

    /**
     * Sets the value to be validated
     * @param data - The value to validate
     * @returns this - For method chaining
     */
    public setData(data: unknown): this {
        this.data = data
        return this
    }

    /**
     * Gets the current value being validated
     * @returns The value being validated
     */
    public getData(): unknown {
        return this.data
    }

    /**
     * Sets all attributes/fields being validated
     * @param attributes - Object containing all fields being validated
     * @returns this - For method chaining
     */
    public setAttributes(attributes: unknown): this {
        this.attributes = attributes
        return this
    }

    /**
     * Gets all attributes/fields being validated
     * @returns Object containing all fields being validated
     */
    public getAttributes(): unknown {
        return this.attributes
    }

    /**
     * Gets a specific option value by key
     * @param key - The option key to retrieve
     * @returns The option value
     */
    public getOption(key: string): unknown {
        return this.options[key]
    }

    /**
     * Gets the name of this validation rule
     * @returns The rule name
     */
    public getName(): string {
        return this.name
    }

    /**
     * Gets the error message template
     * @returns The error template string
     */
    protected getErrorTemplate(): string {
        return this.errorTemplate
    }

    /**
     * Sets the dot notation path to the field being validated
     * @param path - The field path (e.g. "users.*.name")
     * @returns this - For method chaining
     */
    public setPath(path: string): this {
        this.path = path
        return this
    }

    /**
     * Gets the dot notation path to the field being validated
     * @returns The field path
     */
    public getPath(): string {
        return this.path
    }

    /**
     * Builds an error message by replacing placeholders in the error template
     * @param replace - Object containing key-value pairs to replace in the template
     * @returns The formatted error message
     */
    protected buildError(replace?: Record<string, unknown>): string {
        try {

            let error = this.errorTemplate.replace(':attribute', this.getPath())

            if (!replace) {
                return error
            }

            for (const [key, value] of Object.entries(replace)) {
                error = error.replace(`:${key}`, forceString(value))
            }


            return error
        }
        catch (err) {
            logger().exception(err as Error)
            return this.defaultError
        }
    }


}

export default AbstractRule;





