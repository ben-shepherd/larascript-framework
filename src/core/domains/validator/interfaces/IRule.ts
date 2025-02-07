import { IValidatorAttributes } from "./IValidator"

/* eslint-disable no-unused-vars */
export interface IRuleConstructor {
    new (...args: any[]): IRule
}

export interface IRulesObject {
    [key: string]: IRule
}

export interface IRuleError {
    [key: string]: string
}


export interface IRule {
    setField(field: string): this
    setAttributes(attributes: IValidatorAttributes): this
    validate(attributes: IValidatorAttributes): boolean
    getError(): IRuleError
    getName(): string
}





