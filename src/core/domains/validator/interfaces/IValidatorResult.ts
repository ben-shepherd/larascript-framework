import { IValidatorAttributes } from "./IValidator";

export interface IValidatorResult<T extends IValidatorAttributes = IValidatorAttributes> {
    passes(): boolean;
    fails(): boolean;
    errors(): Record<string, string[]>;
    validated(): T;
}




