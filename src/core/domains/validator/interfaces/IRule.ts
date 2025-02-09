
/* eslint-disable no-unused-vars */
export interface IRuleConstructor {
    new (...args: any[]): IRule
}

export interface IRulesObject {
    [key: string]: IRule | IRule[]
}

export interface IRuleError {
    [key: string]: string
}


export interface IRule {
    setPath(field: string): this
    getPath(): string
    setData(data: unknown): this
    setAttributes(attributes: unknown): this
    validate(): boolean
    getError(): IRuleError
    getName(): string




}





