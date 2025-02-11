import AbstractRule from "@src/core/domains/validator/abstract/AbstractRule";
import { IRule, IRuleError } from "@src/core/domains/validator/interfaces/IRule";

class DateRule extends AbstractRule implements IRule {

    protected name: string = 'date';

    protected errorTemplate: string = 'The :attribute must be a valid date.';

    public async test(): Promise<boolean> {

        if (typeof this.getData() !== 'string') {
            return false;
        }

        const date = new Date(this.getData() as string);
        return date instanceof Date && !isNaN(date.getTime());
    }

    getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage()
            ]
        }
    }

}

export default DateRule; 