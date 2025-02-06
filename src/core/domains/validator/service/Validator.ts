import { IRule } from "../interfaces/IRule";
import { IValidator, IValidatorMessages } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

class Validator  implements IValidator {

    constructor(
        private rules: IRule[],
        private messages: IValidatorMessages = {}
    ) {}


    public static make(rules: IRule[], messages: IValidatorMessages = {} as IValidatorMessages): IValidator {
        return new Validator(rules, messages);
    }

    validate<T extends object>(data: T): Promise<IValidatorResult<T>> {
        throw new Error("Method not implemented.");
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

