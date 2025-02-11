
import AbstractRule from "../abstract/AbstractRule";
import { IRule } from "../interfaces/IRule";

class NullableRule extends AbstractRule implements IRule {

    protected name: string = 'nullable'

    protected errorTemplate: string = '';

    public async test(): Promise<boolean> {
        return true
    }

}

export default NullableRule;
