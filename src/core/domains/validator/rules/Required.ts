
import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class Required extends AbstractRule implements IRule {

    protected name: string = 'required'

    protected errorTemplate: string = 'The :attribute field is required.';

    public async test(): Promise<boolean> {
        const value = this.getData()
        return value !== undefined && value !== null && value !== ''
    }

    public getError(): IRuleError {
        return {
            [this.getPath()]: this.buildError()
        }
    }


}


export default Required;
