/* eslint-disable no-unused-vars */
import { IRule, IRulesObject } from "./IRule"
import { IValidatorResult } from "./IValidatorResult"

export type CustomValidatorConstructor = {
    new (...args: any[]): IValidator
}

export type ValidatorConstructor = {
    new (rules: IRule[], messages: IValidatorMessages): IValidator
    make(rules: IRule[], messages: IValidatorMessages): IValidator
}

export type IValidatorMessages = Record<string, string>

export type IValidatorAttributes = Record<string, unknown>

export type IValidatorMake = (rules: IRulesObject, messages?: IValidatorMessages) => IValidator

export interface IValidator<Attributes extends IValidatorAttributes = IValidatorAttributes> {
    validate(data: Attributes): Promise<IValidatorResult<Attributes>>
    passes(): boolean
    errors(): Record<string, string[]>
    validated(): Attributes;
    getRules(): IRulesObject;
    getMessages(): IValidatorMessages;
}



