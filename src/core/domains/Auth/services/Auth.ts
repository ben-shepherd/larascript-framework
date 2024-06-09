import Singleton from '../../../base/Singleton';
import UnauthorizedError from '../../../exceptions/UnauthorizedError';
import { IAuth } from '../../../interfaces/IAuth';
import { IAuthConfig } from '../../../interfaces/IAuthConfig';
import apiTokenFactory from '../factory/apiTokenFactory';
import jwtTokenFactory from '../factory/jwtTokenFactory';
import BaseApiTokenModel from '../models/BaseApiTokenModel';
import BaseUserModel from '../models/BaseUserModel';
import BaseApiTokenRepository from '../repository/BaseApiTokenRepository';
import BaseUserRepository from '../repository/BaseUserRepository';
import { JWTToken } from '../types/types.t';
import comparePassword from '../utils/comparePassword';
import createJwt from '../utils/createJwt';
import decodeJwt from '../utils/decodeJwt';

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