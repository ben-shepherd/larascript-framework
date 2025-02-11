import BaseProvider from "@src/core/base/Provider";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import { IValidatorMessages } from "@src/core/domains/validator/interfaces/IValidator";
import Validator from "@src/core/domains/validator/service/Validator";

class ValidatorProvider extends BaseProvider {

    async register(): Promise<void> {
        this.bind('validator', (rules: IRulesObject, messages: IValidatorMessages = {}) => Validator.make(rules, messages));
    }

}

export default ValidatorProvider