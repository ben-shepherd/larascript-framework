
/* eslint-disable no-unused-vars */
export interface IRuleConstructor {
    new (...args: any[]): IRule
}

export interface IRulesObject {
    [key: string]: IRule | IRule[]
}

export interface IRuleError {
    [key: string]: string[]
}


export interface IRule {
    setDotNotationPath(field: string): this
    getDotNotationPath(): string
    setData(data: unknown): this
    setAttributes(attributes: unknown): this
    setMessages(messages: Record<string, string>): this
    validate(): Promise<boolean>
    getError(): IRuleError
    getCustomError(): IRuleError | undefined
    getName(): string




}





