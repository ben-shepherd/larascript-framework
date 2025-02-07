import { IValidatorAttributes } from "../interfaces/IValidator";
import { IValidatorResult } from "../interfaces/IValidatorResult";

class ValidatorResult<T extends IValidatorAttributes> implements IValidatorResult<T> {

    constructor(
        // eslint-disable-next-line no-unused-vars
        private _passes: boolean,
        // eslint-disable-next-line no-unused-vars
        private _errors: Record<string, string> | undefined = undefined,


    ) {}

    public static passes<T extends IValidatorAttributes = IValidatorAttributes>(): IValidatorResult<T> {
        return new ValidatorResult<T>(true);
    }

    public static fails<T extends IValidatorAttributes = IValidatorAttributes>(errors: Record<string, string>): IValidatorResult<T> {
        return new ValidatorResult<T>(false, errors);
    }

    public passes(): boolean {
        return this._passes;
    }

    public fails(): boolean {
        return !this._passes;
    }

    public errors(): Record<string, string> | undefined {
        return this._errors;
    }

}

export default ValidatorResult; 
