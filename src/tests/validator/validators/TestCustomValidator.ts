import User from "@src/app/models/auth/User";
import BaseCustomValidator from "@src/core/domains/validator/base/BaseCustomValidator";
import { IRulesObject } from "@src/core/domains/validator/interfaces/IRule";
import { IValidatorAttributes } from "@src/core/domains/validator/interfaces/IValidator";
import EmailRule from "@src/core/domains/validator/rules/EmailRule";
import MinRule from "@src/core/domains/validator/rules/MinRule";
import RequiredRule from "@src/core/domains/validator/rules/RequiredRule";
import StringRule from "@src/core/domains/validator/rules/StringRule";
import UniqueRule from "@src/core/domains/validator/rules/UniqueRule";

class TestCreateUserValidator extends BaseCustomValidator {

    protected rules: IRulesObject = {
        email: [new RequiredRule(), new EmailRule(), new UniqueRule(User, 'email')],
        password: [new RequiredRule(), new MinRule(6)],
        firstName: [new RequiredRule(), new StringRule()],
        lastName: [new RequiredRule(), new StringRule()]
    }

    public async customValidation(data: IValidatorAttributes): Promise<boolean> {
        if(data.firstName !== 'John') {
            this.addErrors({
                'firstName.custom': ['The first name should be John']
            })
            return false
        }
        return true
    }

}

export default TestCreateUserValidator