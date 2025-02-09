import DataExtractor from "@src/core/util/data/DataExtractor";

import ValidatorResult from "../data/ValidatorResult";
import { IRule, IRulesObject } from "../interfaces/IRule";
import { IValidator, IValidatorAttributes, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

class Validator  implements IValidator {

    private rules: IRulesObject;

    private messages: IValidatorMessages;

    protected _errors: Record<string, string> = {};

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
        const extractedData = DataExtractor.reduce(attributes, this.rules);

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

    /**
     * Validates an array of rules for a given path and attributes
     * @param path - The path of the field being validated
     * @param rules - The array of rules to validate
     * @param attributes - The attributes to validate against
     * @returns A promise resolving to the validation result
     */
    protected async validateRulesArray(path: string, rules: IRule[], data: unknown, attributes: unknown): Promise<IValidatorResult> {
        for (const rule of rules) {
            const result = this.validateRule(path, rule, data, attributes);


            if (result.fails()) {
                this._errors = {
                    ...this._errors,
                    ...result.errors(),
                }

                return ValidatorResult.fails(this._errors);
            }
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
    protected validateRule(key: string, rule: IRule, data: unknown, attributes: unknown): IValidatorResult {

        rule.setField(key)
        rule.setData(data)
        rule.setAttributes(attributes)
        const passes = rule.validate();

        console.log('[Validator] validateRule', {
            key,
            rule,
            attributes: data,
            passes
        })

        if (!passes) {
            return ValidatorResult.fails(rule.getError());

        }        

        return ValidatorResult.passes();
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

