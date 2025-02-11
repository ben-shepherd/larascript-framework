import DotNotationDataExtrator from "@src/core/util/data/DotNotation/DataExtractor/DotNotationDataExtrator";

import ValidatorResult from "../data/ValidatorResult";
import ValidatorException from "../exceptions/ValidatorException";
import { IRule, IRulesObject } from "../interfaces/IRule";
import { IValidator, IValidatorAttributes, IValidatorMake, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

/**
 * Short hand for creating a new validator on the fly
 */
export const validator: IValidatorMake = (rules: IRulesObject, messages: IValidatorMessages = {}) => Validator.make(rules, messages);

class Validator  implements IValidator {

    private rules: IRulesObject;

    private messages: IValidatorMessages;

    protected _errors: Record<string, string[]> | undefined = undefined;

    protected validatedData: Record<string, unknown> = {};

    constructor(
        rules: IRulesObject,
        messages: IValidatorMessages = {}
    ) {
        this.rules = rules;
        this.messages = messages;
    }

    public static make(rules: IRulesObject, messages: IValidatorMessages = {} as IValidatorMessages): IValidator {
        return new Validator(rules, messages) as IValidator;
    }

    /**
     * Validates the data against the rules and messages
     * @param attributes - The data to validate
     * @returns A promise resolving to the validation result
     */
    async validate<T extends IValidatorAttributes = IValidatorAttributes>(attributes: T): Promise<IValidatorResult<T>> {
        // Reset errors before each validation run
        this._errors = {};

        // Copy the attributes to the validatedData object
        // These will be removed if the rule fails
        this.validatedData = {...attributes}

        // Extract only the data fields that have validation rules defined
        const extractedData = this.extractData(attributes);

        // Validate each field with its corresponding rule
        for (const path of Object.keys(this.rules)) {
            const rules = this.rules[path];
            const rulesArray = Array.isArray(rules) ? rules : [rules];
            const ruleData = extractedData[path];

            // Validate the rules array
            // Merge the errors, if any
            await this.validateRulesArray(path, rulesArray, ruleData, attributes);
        }

        // If there are any validation errors, return a fails result
        if(Object.keys(this._errors).length > 0) {
            return ValidatorResult.fails<T>(this._errors, this.validatedData as T);
        }

        return ValidatorResult.passes<T>(this.validatedData as T);
    }

    /**
     * Extracts data from attributes object based on defined validation rules paths
     * 
     * This method takes the full attributes object and extracts only the data that needs
     * to be validated based on the rule paths defined. It maintains the nested structure
     * using dot notation (e.g. users.*.name) and returns an object where:
     * 
     * - Keys are the dot notation paths matching the validation rules
     * - Values are the corresponding data at those paths
     * 
     * For example, given attributes:
     * {
     *   users: [{name: "John"}, {name: "Jane"}]
     * }
     * 
     * And rules for "users.*" and "users.*.name", it would extract:
     * {
     *   "users.*": [{name: "John"}, {name: "Jane"}],
     *   "users.*.name": ["John", "Jane"]
     * }
     * 
     * This ensures we only validate data that has corresponding rules while preserving
     * the nested structure needed for proper validation.
     * 
     * @param attributes - The full data object to extract from
     * @returns Record mapping rule paths to their corresponding data values
     */
    protected extractData(attributes: IValidatorAttributes): Record<string, unknown> {
        const result = DotNotationDataExtrator.reduceMany(attributes, Object.keys(this.rules));

        return Object.keys(result).reduce((acc, key) => {
            acc[key] = result[key];
            return acc;
        }, {} as Record<string, unknown>);
    }

    /**
     * Validates an array of rules for a given path and attributes
     * @param path - The path of the field being validated
     * @param rules - The array of rules to validate
     * @param attributes - The attributes to validate against

     * @returns A promise resolving to the validation result
     */
    protected async validateRulesArray(path: string, rules: IRule[], data: unknown, attributes: unknown): Promise<IValidatorResult> {
        for(const key of Object.keys(rules)) {
            const rule = rules[key] as IRule
            const otherRules = rules.filter(r => r.getName() !== rule.getName())
            const result = await this.validateRule(path, rule, data, attributes, otherRules);

            if (result.fails()) {
                this.mergeErrors(path, result.errors() ?? {})
                continue;
            }
        }

        if(Object.keys(this._errors as object).length > 0) {
            return ValidatorResult.fails(this._errors as Record<string, string[]>);
        }

        return ValidatorResult.passes();
    }

    /**
     * Validates a single rule for a given path and attributes
     * @param key - The path of the field being validated
     * @param rule - The rule to validate
     * @param data - The attributes to validate against
     * @returns A promise resolving to the validation result
     */
    protected async validateRule(key: string, rule: IRule, data: unknown, attributes: unknown, otherRules: IRule[]): Promise<IValidatorResult> {

        rule.setDotNotationPath(key)
        rule.setData(data)
        rule.setAttributes(attributes)
        rule.setMessages(this.messages)
        rule.setOtherRuleNames(otherRules.map(r => r.getName()))
        const passes = await rule.validate();

        // If the rule fails, remove the validated data
        if (!passes) {
            this.removeValidatedData(key)
            return ValidatorResult.fails(rule.getCustomError() ?? rule.getError());
        }        

        // Merge the validated data
        this.mergeValidatedData(key, attributes?.[key])

        return ValidatorResult.passes();
    }

    /**
     * Removes validated data from the internal validatedData object
     * @param key - The dot notation path of the field with validated data
     */
    protected removeValidatedData(key: string): void {
        if(this.validatedData[key]) {
            delete this.validatedData[key]
        }
    }

    /**
     * Merges validated data into the internal validatedData object
     * @param key - The dot notation path of the field with validated data
     * @param data - The validated data to merge
     */
    protected mergeValidatedData(key: string, data: unknown): void {
        if(!this.validatedData) {
            this.validatedData = {}
        }

        this.validatedData[key] = data
    }

    /**
     * Merges validation errors into the internal errors object
     * @param key - The dot notation path of the field with errors
     * @param errors - The errors to merge
     */
    protected mergeErrors(key: string, errors: Record<string, string[]>): void {
        if(typeof this._errors !== 'object') {
            this._errors = {}
        }
        if(!this._errors[key]) {
            this._errors[key] = []
        }

        this._errors[key] = [...this._errors[key], ...errors[key]]
    }

    /**
     * Returns the validated data
     * @returns The validated data
     */
    validated(): IValidatorAttributes {
        if(typeof this._errors !== 'object') {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return this.validatedData;
    }

    /**
     * Returns true if the validation failed
     * @returns True if the validation failed
     */
    fails(): boolean {
        if(typeof this._errors !== 'object') {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return Object.keys(this._errors as object).length > 0;
    }

    /**
     * Returns true if the validation passed
     * @returns True if the validation passed
     */
    passes(): boolean {
        if(typeof this._errors !== 'object') {
            throw new ValidatorException('Validator has not been validated yet')
        }
        
        return Object.keys(this._errors as object).length === 0;
    }

    /**
     * Returns the validation errors
     * @returns The validation errors
     */
    errors(): Record<string, string[]> {
        if(typeof this._errors !== 'object') {
            throw new ValidatorException('Validator has not been validated yet')
        }

        return this._errors as Record<string, string[]>;
    }

}

export default Validator;

