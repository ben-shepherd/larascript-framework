import ApiToken from '@src/app/models/auth/ApiToken';
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import { AuthConfigTypeHelpers } from '@src/config/auth/auth';
import Service from '@src/core/base/Service';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import apiTokenFactory from '../factory/apiTokenFactory';
import jwtTokenFactory from '../factory/jwtTokenFactory';
import { IAuthConfig } from '../interfaces/IAuthConfig';
import { IAuthService } from '../interfaces/IAuthService';
import BaseApiTokenRepository from '../repository/BaseApiTokenRepository';
import { JWTToken } from '../types/types.t';
import comparePassword from '../utils/comparePassword';
import createJwt from '../utils/createJwt';
import decodeJwt from '../utils/decodeJwt';

type UserModel = AuthConfigTypeHelpers['userModel']
type UserRepository = AuthConfigTypeHelpers['userRepository']

export default class BaseAuthService extends Service<IAuthConfig> implements IAuthService {
    public config: IAuthConfig | null;

    /**
     * Repository for accessing user data
     */
    public userRepository: UserRepository;
    /**
     * Repository for accessing api tokens
     */
    public apiTokenRepository: BaseApiTokenRepository;

    constructor(
        config: IAuthConfig,
    ) {
        super()
        this.config = config;
        this.userRepository = new config.userRepository;
        this.apiTokenRepository = new ApiTokenRepository();
    }

    /**
     * Create a new ApiToken model from the User
     * @param user 
     * @returns 
     */
    public async createApiTokenFromUser(user: UserModel): Promise<ApiToken> {
        const apiToken = apiTokenFactory<ApiToken>(user, this.apiTokenRepository.model);
        await apiToken.save();
        return apiToken
    }
    
    /**
     * Creates a JWT from a user model
     * @param user 
     * @returns 
     */
    async createJwtFromUser(user: UserModel): Promise<string> {
        const apiToken = await this.createApiTokenFromUser(user);
        return this.jwt(apiToken)
    }

    jwt(apiToken: ApiToken): string {
        if(!apiToken?.data?.userId) {
            throw new Error('Invalid token');
        }
        const payload = jwtTokenFactory(apiToken.data?.userId?.toString(), apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: ApiToken): Promise<void> {
        if(apiToken?.data?.revokedAt) {
            return;
        }

        apiToken.setAttribute('revokedAt', new Date());
        await apiToken.save();
    }

    /**
     * Attempt authentication against a JWT
     * @param token 
     * @returns 
     */
    async attemptAuthenticateToken(token: string): Promise<ApiToken | null> {
        const decoded = decodeJwt(token) as JWTToken;

        const apiToken = await this.apiTokenRepository.findOneActiveToken(decoded.token)

        if(!apiToken) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        const user = await this.userRepository.findById(decoded.uid)

        if(!user) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        return apiToken
    }

    /**
     * Attempt login with credentials
     * @param email 
     * @param password 
     * @returns 
     */
    async attemptCredentials(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findOneByEmail(email);

        if(!user?.data?._id) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        if(user?.data?.hashedPassword && !comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        return this.createJwtFromUser(user)
    }
}