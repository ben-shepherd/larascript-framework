import Singleton from '../base/Singleton';
import apiTokenFactory from '../domains/Auth/factory/apiTokenFactory';
import jwtTokenFactory from '../domains/Auth/factory/jwtTokenFactory';
import ApiTokenModel from '../domains/Auth/models/ApiTokenModel';
import BaseUserModel from '../domains/Auth/models/BaseUserModel';
import ApiTokenRepository from '../domains/Auth/repository/ApiTokenRepository';
import BaseUserRepository from '../domains/Auth/repository/BaseUserRepository';
import { JWTToken } from '../domains/Auth/types/types.t';
import comparePassword from '../domains/Auth/utils/comparePassword';
import createJwt from '../domains/Auth/utils/createJwt';
import decodeJwt from '../domains/Auth/utils/decodeJwt';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import { IAuth } from '../interfaces/IAuth';

export default class Auth extends Singleton<any> implements IAuth {
    private userRepository: BaseUserRepository;
    private apiTokenRepository: ApiTokenRepository;

    constructor() {
        super()
        this.userRepository = new BaseUserRepository();
        this.apiTokenRepository = new ApiTokenRepository();
    }

    async createToken(user: BaseUserModel): Promise<string> {
        const apiToken = apiTokenFactory(user);
        await apiToken.save();
        return this.jwt(apiToken)
    }

    private jwt(apiToken: ApiTokenModel): string {
        const payload = jwtTokenFactory(apiToken.data?.userId, apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    async revokeToken(apiToken: ApiTokenModel): Promise<void> {
        if(apiToken?.data?.revokedAt) {
            return;
        }

        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }

    async authenticateToken(token: string): Promise<ApiTokenModel | null> {
        const decoded = decodeJwt(token) as JWTToken;

        const apiToken = await this.apiTokenRepository.findByUnrevokedToken(decoded.token)

        if(!apiToken) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        const user = await this.userRepository.findById(decoded.uid)

        if(!user) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        return apiToken
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        if(!comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        const apiToken = apiTokenFactory(user);
        await apiToken.save();

        return this.jwt(apiToken);
    }
}