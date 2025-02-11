import DotNotationDataExtrator from "@src/core/util/data/DotNotation/DataExtractor/DotNotationDataExtrator";

import ValidatorResult from "../data/ValidatorResult";
import { IRule, IRulesObject } from "../interfaces/IRule";
import { IValidator, IValidatorAttributes, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

class Validator  implements IValidator {

    private rules: IRulesObject;

    private messages: IValidatorMessages;

    protected _errors: Record<string, string[]> = {};

    protected validatedData: Record<string, unknown> = {};

    constructor(
        rules: IRulesObject,
        messages: IValidatorMessages = {},
    ) {
        this.rules = rules;
        this.messages = messages;
    }


    public static make(rules: IRulesObject, messages: IValidatorMessages = {} as IValidatorMessages): IValidator {
        return new Validator(rules, messages);
    }

    /**
     * Validates the data against the rules and messages
     * @param attributes - The data to validate
     * @returns A promise resolving to the validation result
     */
    async validate<T extends IValidatorAttributes = IValidatorAttributes>(attributes: T): Promise<IValidatorResult<T>> {
        // Reset errors before each validation run
        this._errors = {};

        // Extract only the data fields that have validation rules defined
        // This ensures we only validate fields that have rules and maintains
        // the nested structure (e.g. users.0.name) for proper validation
        // Example Structure:
        // {
        //     "users.*": [...],
        //     "users.*.name": ["John", "Jane"  ]
        // }
        const extractedData = this.extractData(attributes);

        // Validate each field with its corresponding rule
        for (const path of Object.keys(this.rules)) {
            const rules = this.rules[path];
            const rulesArray = Array.isArray(rules) ? rules : [rules];
            const ruleData = extractedData[path];

            await this.validateRulesArray(path, rulesArray, ruleData, attributes);
        }

        // If there are any validation errors, return a fails result
        if(Object.keys(this._errors).length > 0) {
            return ValidatorResult.fails<T>(this._errors);
        }
        
        // Passed
        return ValidatorResult.passes<T>();
    }

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
        for (const rule of rules) {
            const result = await this.validateRule(path, rule, data, attributes);

            if (result.fails()) {
                this.mergeErrors(path, result.errors() ?? {})
            }
        }

        if(Object.keys(this._errors).length > 0) {
            return ValidatorResult.fails(this._errors);
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
    protected async validateRule(key: string, rule: IRule, data: unknown, attributes: unknown): Promise<IValidatorResult> {

        rule.setPath(key)
        rule.setData(data)
        rule.setAttributes(attributes)
        rule.setMessages(this.messages)
        const passes = await rule.validate();

        if (!passes) {
            return ValidatorResult.fails(rule.getCustomError() ?? rule.getError());
        }        

        return ValidatorResult.passes();
    }

    mergeErrors(key: string, errors: Record<string, string[]>): void {
        if(!this._errors[key]) {
            this._errors[key] = []
        }

        this._errors[key] = [...this._errors[key], ...errors[key]]
    }

    validated(): unknown {
        return this.validatedData;
    }

    fails(): boolean {
        return false;
    }

    passes(): boolean {
        return true;
    }

    errors(): Record<string, string> {
        return {};
    }

}

export default Validator;

