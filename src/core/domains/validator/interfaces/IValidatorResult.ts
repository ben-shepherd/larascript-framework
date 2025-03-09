/* eslint-disable no-unused-vars */
import { IValidatorAttributes } from "@src/core/domains/validator/interfaces/IValidator";

export interface IValidatorResult<T extends IValidatorAttributes = IValidatorAttributes> {
    passes(): boolean;
    fails(): boolean;
    errors(): Record<string, string[]>;
    validated(): T;
    mergeErrors(errors: Record<string, string[]>): void;
    updatePasses(): void;
}




