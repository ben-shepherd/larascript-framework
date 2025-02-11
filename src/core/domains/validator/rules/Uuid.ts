import AbstractRule from "../abstract/AbstractRule";
import { IRule, IRuleError } from "../interfaces/IRule";

class Uuid extends AbstractRule<{}> implements IRule {

    protected name: string = 'uuid';

    protected errorTemplate: string = 'The :attribute field must be a valid UUID.';

    // UUID v4 regex pattern
    private uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    constructor() {
        super();
        this.options = {};
    }

    public async test(): Promise<boolean> {
        if (this.getData() === undefined || this.getData() === null) {
            return false;
        }

        if (typeof this.getData() !== 'string') {
            return false;
        }

        return this.uuidRegex.test(this.getData() as string);
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({})
            ]
        };
    }

}

export default Uuid; 