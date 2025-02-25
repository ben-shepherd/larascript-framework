import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

class EmailRule extends AbstractRule<{}> implements IRule {

    protected name: string = 'email';

    protected errorTemplate: string = 'The :attribute field must be a valid email address.';

    // RFC 5322 compliant email regex
    private emailRegex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    public async test(): Promise<boolean> {

        if (typeof this.getData() !== 'string') {
            return false;
        }

        return this.emailRegex.test(this.getData() as string);
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({})
            ]
        };
    }

}

export default EmailRule; 