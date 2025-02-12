import User from "@src/app/models/auth/User";
import BaseCustomValidator from "@src/core/domains/validator/base/BaseCustomValidator";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import EmailRule from "@src/core/domains/validator/rules/EmailRule";
import MinRule from "@src/core/domains/validator/rules/MinRule";
import NullableRule from "@src/core/domains/validator/rules/NullableRule";
import RequiredRule from "@src/core/domains/validator/rules/RequiredRule";
import StringRule from "@src/core/domains/validator/rules/StringRule";
import UniqueRule from "@src/core/domains/validator/rules/UniqueRule";

class CreateUserValidator extends BaseCustomValidator {

    protected rules: IRulesObject = {
        email: [new RequiredRule(), new EmailRule(), new UniqueRule(User, 'email')],
        password: [new RequiredRule(), new MinRule(6)],
        firstName: [new NullableRule(), new StringRule()],
        lastName: [new NullableRule(), new StringRule()]
    }

    protected messages: Record<string, string> = {
        'email.unique': 'The email has already been taken.'
    }

}

export default CreateUserValidator