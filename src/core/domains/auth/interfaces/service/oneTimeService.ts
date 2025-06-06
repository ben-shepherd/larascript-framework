import { ApiTokenModelOptions, IApiTokenModel } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";

type SingleUseTokenOptions = Required<Pick<ApiTokenModelOptions, 'expiresAfterMinutes'>>

export interface IOneTimeAuthenticationService {
    getScope(): string;
    createSingleUseToken(user: IUserModel, scopes?: string[], options?: SingleUseTokenOptions): Promise<string>;
    validateSingleUseToken(apiToken: IApiTokenModel): boolean;
}
