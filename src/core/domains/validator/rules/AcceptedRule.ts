
import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule } from "@src/core/domains/validator/interfaces/IRule";
import isTruthy from "@src/core/domains/validator/utils/isTruthy";

class AcceptedRule extends AbstractRule implements IRule {

    protected name: string = 'accepted'

    protected errorTemplate: string = 'The :attribute field must be accepted.';

    public async test(): Promise<boolean> {
        return isTruthy(this.getAttributeData())
    }

}


export default AcceptedRule;
