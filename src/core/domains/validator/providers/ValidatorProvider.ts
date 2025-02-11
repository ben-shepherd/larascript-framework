import BaseProvider from "@src/core/base/Provider";

import { IRulesObject } from "../interfaces/IRule";
import { IValidatorMessages } from "../interfaces/IValidator";
import Validator from "../service/Validator";

class ValidatorProvider extends BaseProvider {

    async register(): Promise<void> {
        this.bind('validator', (rules: IRulesObject, messages: IValidatorMessages = {}) => Validator.make(rules, messages));
    }

}

export default ValidatorProvider