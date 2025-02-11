import forceString from "@src/core/util/str/forceString";

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

    /** Custom messages for the rule */ 
    protected messages: Record<string, string> = {};

    /** All attributes/fields being validated */
    protected attributes: unknown = undefined

    /** Dot notation path to the field being validated (e.g. "users.*.name") */
    protected path!: string;

    /** Overridable error message for the rule, undefined by default */
    protected errorMessage?: string = undefined

    /**
     * Tests if the current data value passes the validation rule
     * @returns True if validation passes, false if it fails
     */
    public abstract test(): Promise<boolean>;

    /**
     * Validates the data against the rule
     * 
     * @returns True if validation passes, false if it fails
     */
    public async validate(): Promise<boolean> {
        return await this.test()
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
     * Sets the custom messages for the rule
     * @param messages - Object containing custom messages
     * @returns this - For method chaining
     */
    public setMessages(messages: Record<string, string>): this {
        this.messages = messages
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
     * Gets the custom message for the rule
     * @returns The custom message
     */
    public getCustomError(): IRuleError | undefined {
        const key = `${this.getPath()}.${this.getName()}`
        
        if(this.messages[key]) {
            return {
                [this.getPath()]: [this.messages[key]]
            }
        }

        return undefined
    }
    
    /**
     * Gets the error message for the rule
     * @returns The error message
     */
    public getError(): IRuleError {
        return {
            [this.getPath()]: [this.errorMessage ?? this.formatErrorMessage()]
        }
    }

    /**
     * Builds an error message by replacing placeholders in the error template
     * 
     * @param replacer - Object containing key-value pairs to replace in the template
     * @param error - The error template string
     * @returns The formatted error message
     */
    protected formatErrorMessage(replacer: Record<string, unknown> = {}, error: string = this.errorTemplate): string {
        // Add attributes to replacer if it doesn't exist
        if(!replacer['attribute']) {
            replacer.attribute = this.getPath()
        }

        // Replace placeholders in the error template
        for (const [key, value] of Object.entries(replacer)) {
            error = error.replace(`:${key}`, forceString(value))
        }

        return error
    }

}

export default AbstractRule;





