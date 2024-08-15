import ApiToken from "@app/models/auth/ApiToken";
import User from "@app/models/auth/User";
import ApiTokenRepository from "@app/repositories/auth/ApiTokenRepository";
import UserRepository from "@app/repositories/auth/UserRepository";
import IService from "@src/core/interfaces/IService";


export interface IAuthService extends IService {
    config: any;
    userRepository: UserRepository,
    apiTokenRepository: ApiTokenRepository,
    attemptAuthenticateToken: (token: string) => Promise<ApiToken | null>
    createJwtFromUser: (user: User) => Promise<string>
    createApiTokenFromUser: (user: User) => Promise<ApiToken>
    revokeToken: (apiToken: ApiToken) => Promise<void>
    attemptCredentials: (email: string, password: string) => Promise<string>
    jwt: (apiToken: ApiToken) => string
}

