import { IValidatorResult } from "../interfaces/IValidatorResult";

class ValidatorResult<T extends object> implements IValidatorResult<T> {

    constructor(
        private _passes: boolean,
        private _fails: boolean,
        private _errors: Record<string, string>,
        private _validated: T
    ) {}


    public passes(): boolean {
        return this._passes;
    }


    public fails(): boolean {
        return this._fails;
    }


    public errors(): Record<string, string> {
        return this._errors;
    }


    public validated(): T {
        return this._validated;
    }


}

export default ValidatorResult; 
