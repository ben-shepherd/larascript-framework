import Service from '@src/core/base/Service';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import ApiTokenFactory from '@src/core/domains/auth/factory/ApiTokenFactory';
import JWTTokenFactory from '@src/core/domains/auth/factory/JwtTokenFactory';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import IApiTokenRepository from '@src/core/domains/auth/interfaces/IApiTokenRepository';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import IUserRepository from '@src/core/domains/auth/interfaces/IUserRepository';
import comparePassword from '@src/core/domains/auth/utils/comparePassword';
import createJwt from '@src/core/domains/auth/utils/createJwt';
import decodeJwt from '@src/core/domains/auth/utils/decodeJwt';
import { IJSonWebToken } from '../interfaces/IJSonWebToken';

export default class AuthService extends Service<IAuthConfig> implements IAuthService {

    /**
     * Auth config
     */
    public config: IAuthConfig;

    /**
     * Repository for accessing user data
     */
    public userRepository: IUserRepository;
    
    /**
     * Repository for accessing api tokens
     */
    public apiTokenRepository: IApiTokenRepository;


    constructor(
        config: IAuthConfig
    ) {
        super()
        this.config = config;
        this.userRepository = new config.repositories.user;
        this.apiTokenRepository = new config.repositories.apiToken;
    }

    /**
     * Create a new ApiToken model from the User
     * @param user 
     * @returns 
     */
    public async createApiTokenFromUser(user: IUserModel): Promise<IApiTokenModel> {
        const apiToken = new ApiTokenFactory().createFromUser(user)
        await apiToken.save();
        return apiToken
    }
    
    /**
     * Creates a JWT from a user model
     * @param user 
     * @returns 
     */
    async createJwtFromUser(user: IUserModel): Promise<string> {
        const apiToken = await this.createApiTokenFromUser(user);
        return this.jwt(apiToken)
    }

    /**
     * Generates a JWT
     * @param apiToken 
     * @returns 
     */
    jwt(apiToken: IApiTokenModel): string {
        if(!apiToken?.data?.userId) {
            throw new Error('Invalid token');
        }
        const payload = new JWTTokenFactory().create(apiToken.data?.userId?.toString(), apiToken.data?.token);
        return createJwt(payload, '1d');
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
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
    async attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null> {
        const decoded = decodeJwt(token) as IJSonWebToken;

        const apiToken = await this.apiTokenRepository.findOneActiveToken(decoded.token)

        if(!apiToken) {
            throw new UnauthorizedError()
        }

        const user = await this.userRepository.findById(decoded.uid)

        if(!user) {
            throw new UnauthorizedError()
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
        const user = await this.userRepository.findOneByEmail(email) as IUserModel;

        if(!user?.data?._id) {
            throw new UnauthorizedError()
        }

        if(user?.data?.hashedPassword && !comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError()
        }

        return this.createJwtFromUser(user)
    }
}