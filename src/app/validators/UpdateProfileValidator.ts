import BaseCustomValidator from "@src/core/domains/validator/base/BaseCustomValidator";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import MinRule from "@src/core/domains/validator/rules/MinRule";
import NullableRule from "@src/core/domains/validator/rules/NullableRule";
import SameRule from "@src/core/domains/validator/rules/SameRule";
import StringRule from "@src/core/domains/validator/rules/StringRule";

import UpdatePasswordUseCase from "../useCases/auth/profile/UpdatePasswordUseCase";

class UpdateProfileValidator extends BaseCustomValidator {

    protected rules: IRulesObject = {
        firstName: [new StringRule(), new MinRule(2)],
        lastName: [new StringRule(), new MinRule(2)],
        password: [new NullableRule(), new StringRule(), new MinRule(UpdatePasswordUseCase.minPasswordLength())],
        confirmPassword: [new NullableRule(), new StringRule(), new SameRule('password')]
    }
    
}

export default UpdateProfileValidator