import BaseCustomValidator from "@src/core/domains/validator/base/BaseCustomValidator";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import MinRule from "@src/core/domains/validator/rules/MinRule";
import NullableRule from "@src/core/domains/validator/rules/NullableRule";
import StringRule from "@src/core/domains/validator/rules/StringRule";

class UpdateUserValidator extends BaseCustomValidator {

    protected rules: IRulesObject = {
        password: [new NullableRule(), new MinRule(6)],
        firstName: [new NullableRule(), new StringRule()],
        lastName: [new NullableRule(), new StringRule()]
    }

}

export default UpdateUserValidator