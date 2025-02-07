/* eslint-disable no-unused-vars */
import { IRule } from "./IRule"
import { IValidatorResult } from "./IValidatorResult"

export type ValidatorConstructor = {
    new (): IValidator
    make(rules: IRule[], messages: IValidatorMessages): IValidator
}

export type IValidatorMessages = Record<string, string>

export type IValidatorAttributes = Record<string, unknown>

export interface IValidator {
    validate<T extends IValidatorAttributes>(data: T): Promise<IValidatorResult<T>>
}



