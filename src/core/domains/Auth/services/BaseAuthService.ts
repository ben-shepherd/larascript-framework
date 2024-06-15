import { AuthConfigTypeHelpers } from '@src/config/auth/auth';
import Service from '@src/core/base/Service';
import UnauthorizedError from '../exceptions/UnauthorizedError';
import apiTokenFactory from '../factory/apiTokenFactory';
import jwtTokenFactory from '../factory/jwtTokenFactory';
import { IAuthConfig } from '../interfaces/IAuthConfig';
import { IAuthService } from '../interfaces/IAuthService';
import { JWTToken } from '../types/types.t';
import comparePassword from '../utils/comparePassword';
import createJwt from '../utils/createJwt';
import decodeJwt from '../utils/decodeJwt';

export default class BaseAuthService extends Service<IAuthConfig> implements IAuthService {
    /**
     * Repository for accessing user data
     */
    public userRepository: AuthConfigTypeHelpers['userRepository'];
    /**
     * Repository for accessing api tokens
     */
    public apiTokenRepository: AuthConfigTypeHelpers['apiTokenRepository'];

    constructor(
        config: IAuthConfig,
    ) {
        super(config)
        this.userRepository = new config.userRepository;
        this.apiTokenRepository = new config.apiTokenRepository;
    }

    /**
     * Creates a JWT from a user model
     * @param user 
     * @returns 
     */
    async createToken(user: AuthConfigTypeHelpers['userModel']): Promise<string> {
        const apiToken = apiTokenFactory<AuthConfigTypeHelpers['apiTokenModel']>(user, this.apiTokenRepository.model);
        await apiToken.save();
        return this.jwt(apiToken)
    }

    jwt(apiToken: AuthConfigTypeHelpers['apiTokenModel']): string {
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
    async revokeToken(apiToken: AuthConfigTypeHelpers['apiTokenModel']): Promise<void> {
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
    async attemptAuthenticateToken(token: string): Promise<AuthConfigTypeHelpers['apiTokenModel'] | null> {
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

    /**
     * Attempt login with credentials
     * @param email 
     * @param password 
     * @returns 
     */
    async attemptCredentials(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);

        if(!user?.data?._id) {
            throw new UnauthorizedError('Unauthorized (Error code: 1)')
        }

        if(user?.data?.hashedPassword && !comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError('Unauthorized (Error code: 2)')
        }

        return this.createToken(user)
    }
}