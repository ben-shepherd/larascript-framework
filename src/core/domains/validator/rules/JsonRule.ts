import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class JsonRule extends AbstractRule implements IRule {

    protected name: string = 'json';

    protected errorTemplate: string = 'The :attribute must be a valid JSON string.';

    public async test(): Promise<boolean> {
        if (this.getData() === undefined || this.getData() === null) {
            return false;
        }

        if (typeof this.getData() !== 'string') {
            return false;
        }

        try {
            JSON.parse(this.getData() as string);
        }
        // eslint-disable-next-line no-unused-vars
        catch (e) {
            return false;
        }

        return true;
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage()
            ]
        }
    }

}

export default JsonRule; 