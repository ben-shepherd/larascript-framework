import ApiTokenRepository from '../../../../app/repositories/ApiTokenRepository';
import UserRepository from '../../../../app/repositories/UserRepository';
import BaseService from '../../../base/Service';
import UnauthorizedError from '../../../exceptions/UnauthorizedError';
import { IAuth } from '../../../interfaces/IAuth';
import { IAuthConfig } from '../../../interfaces/IAuthConfig';
import apiTokenFactory from '../factory/apiTokenFactory';
import jwtTokenFactory from '../factory/jwtTokenFactory';
import BaseApiTokenModel from '../models/BaseApiTokenModel';
import BaseUserModel from '../models/BaseUserModel';
import { JWTToken } from '../types/types.t';
import comparePassword from '../utils/comparePassword';
import createJwt from '../utils/createJwt';
import decodeJwt from '../utils/decodeJwt';

export default class AuthService<
    TUser extends BaseUserModel,
    TApiToken extends BaseApiTokenModel
>extends BaseService<IAuthConfig> implements IAuth {
    public userRepository: UserRepository
    public apiTokenRepository: ApiTokenRepository;

    constructor(config: IAuthConfig) {
        super(config)
        this.userRepository = new UserRepository()
        this.apiTokenRepository = new ApiTokenRepository()
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

    async attemptAuthenticateToken(token: string): Promise<BaseApiTokenModel | null> {
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

    async attemptCredentials(email: string, password: string): Promise<string> {
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