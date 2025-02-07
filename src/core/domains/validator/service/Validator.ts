import ValidatorResult from "../data/ValidatorResult";
import { IRule, IRulesObject } from "../interfaces/IRule";
import { IValidator, IValidatorAttributes, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

class Validator  implements IValidator {

    protected _errors: Record<string, string> = {};

    constructor(
        private rules: IRulesObject,
        private messages: IValidatorMessages = {},
    ) {}



    public static make(rules: IRulesObject, messages: IValidatorMessages = {} as IValidatorMessages): IValidator {
        return new Validator(rules, messages);
    }

    async validate<T extends IValidatorAttributes = IValidatorAttributes>(data: T): Promise<IValidatorResult<T>> {
        this._errors = {};

        /**
         * Todo:
         * We need a function to group keys into a new loopable object to handle sub keys
         * e.g. Key 'users', 'users.id', 'users.name' might become
         * {
         *    users: {
         *      'id': 1,
         *      'name': 1
         *    }
         * }
         * 
         * Or key: 'users.*'
         * {
         *    users: {
         *       '*': 1
         *    }
         * }
         * 
         * Or key: 'users.0.id' 
         * {
         *     users: {
         *        0: {
         *          id: 1
         *        }
         *     }
         * }
         */


        for (const [key, rule] of Object.entries(this.rules)) {
            this.validateRule(key, rule, data);
        }

        if(Object.keys(this._errors).length > 0) {
            return ValidatorResult.fails<T>(this._errors);
        }
        
        return ValidatorResult.passes<T>();
    }

    protected validateRule(key: string, rule: IRule, attributes: IValidatorAttributes): IValidatorResult {
        const result = this.getRuleResult(key, rule, attributes);

        if (result.fails()) {
            this._errors = {
                ...this._errors,
                ...result.errors(),
            }
        }

        return result;
    }

    /**
     * todo: we need a new paramter to pass the value inside the rule
     */
    protected getRuleResult(key: string, rule: IRule, attributes: IValidatorAttributes): IValidatorResult {
        const passes = rule.setField(key)
            .setAttributes(attributes)
            .validate(attributes);

        if (!passes) {
            return ValidatorResult.fails(rule.getError());
        }        

        return ValidatorResult.passes();
    }


    validated(): unknown {
        throw new Error("Method not implemented.");
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

