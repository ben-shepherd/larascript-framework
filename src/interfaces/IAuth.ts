import ApiTokenModel from "../domains/Auth/models/ApiTokenModel"

export interface IAuth {
    check: () => Promise<boolean>
    login: (email: string, password: string) => Promise<string>
    logout: (apiToken: ApiTokenModel) => Promise<void>
}