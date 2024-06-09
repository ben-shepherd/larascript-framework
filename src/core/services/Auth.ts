import Singleton from '../base/Singleton';
import apiTokenFactory from '../domains/Auth/factory/apiTokenFactory';
import jwtTokenFactory from '../domains/Auth/factory/jwtTokenFactory';
import BaseApiTokenModel from '../domains/Auth/models/BaseApiTokenModel';
import BaseUserModel from '../domains/Auth/models/BaseUserModel';
import BaseApiTokenRepository from '../domains/Auth/repository/BaseApiTokenRepository';
import BaseUserRepository from '../domains/Auth/repository/BaseUserRepository';
import { JWTToken } from '../domains/Auth/types/types.t';
import comparePassword from '../domains/Auth/utils/comparePassword';
import createJwt from '../domains/Auth/utils/createJwt';
import decodeJwt from '../domains/Auth/utils/decodeJwt';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import { IAuth } from '../interfaces/IAuth';
import { IAuthConfig } from '../interfaces/IAuthConfig';

export default class Auth extends Singleton<IAuthConfig> implements IAuth {
    public userRepository: BaseUserRepository;
    public apiTokenRepository: BaseApiTokenRepository;

    constructor(config: IAuthConfig) {
        super(config)
        this.userRepository = new config.userRepository();
        this.apiTokenRepository = new config.apiTokenRepository();
    }

    async createToken(user: BaseUserModel): Promise<string> {
        const apiToken = apiTokenFactory(user, this.apiTokenRepository.model);
        await apiToken.save();
        return this.jwt(apiToken)
    }

    private jwt(apiToken: BaseApiTokenModel): string {
        if(!apiToken?.data?.userId) {
            throw new Error('Invalid token');
        }
        const payload = jwtTokenFactory(apiToken.data?.userId?.toString(), apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    async revokeToken(apiToken: BaseApiTokenModel): Promise<void> {
        if(apiToken?.data?.revokedAt) {
            return;
        }

        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }

    async authenticateToken(token: string): Promise<BaseApiTokenModel | null> {
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

        if(user?.data?.hashedPassword && !comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        const apiToken = apiTokenFactory(user, this.apiTokenRepository.model);
        await apiToken.save();

        return this.jwt(apiToken);
    }
}