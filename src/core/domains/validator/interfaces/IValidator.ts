/* eslint-disable no-unused-vars */
import { IRule } from "./IRule"
import { IValidatorResult } from "./IValidatorResult"

export type ValidatorConstructor = {
    new (): IValidator
    make(rules: IRule[], messages: IValidatorMessages): IValidator
}

export type IValidatorMessages = Record<string, string>

export interface IValidator {
    validate<T extends object>(data: T): Promise<IValidatorResult<T>>
}


