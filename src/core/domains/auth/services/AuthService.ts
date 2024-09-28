import Service from '@src/core/base/Service';
import InvalidJWTSecret from '@src/core/domains/auth/exceptions/InvalidJWTSecret';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import ApiTokenFactory from '@src/core/domains/auth/factory/apiTokenFactory';
import JWTTokenFactory from '@src/core/domains/auth/factory/jwtTokenFactory';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import IApiTokenRepository from '@src/core/domains/auth/interfaces/IApiTokenRepository';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import IUserRepository from '@src/core/domains/auth/interfaces/IUserRepository';
import authRoutes from '@src/core/domains/auth/routes/auth';
import comparePassword from '@src/core/domains/auth/utils/comparePassword';
import createJwt from '@src/core/domains/auth/utils/createJwt';
import decodeJwt from '@src/core/domains/auth/utils/decodeJwt';
import { IRoute } from '@src/core/domains/express/interfaces/IRoute';
import { JsonWebTokenError } from 'jsonwebtoken';

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
        this.validateJwtSecret();
    }

    /**
     * Validate jwt secret
     */
    private validateJwtSecret() {
        if (!this.config.jwtSecret || this.config.jwtSecret === '') {
            throw new InvalidJWTSecret();
        }
    }

    /**
     * Create a new ApiToken model from the User
     * @param user 
     * @returns 
     */
    public async createApiTokenFromUser(user: IUserModel, scopes: string[] = []): Promise<IApiTokenModel> {
        const apiToken = new ApiTokenFactory().createFromUser(user, scopes)
        await apiToken.save();
        return apiToken
    }

    /**
     * Creates a JWT from a user model
     * @param user 
     * @returns 
     */
    async createJwtFromUser(user: IUserModel, scopes: string[] = []): Promise<string> {
        const apiToken = await this.createApiTokenFromUser(user, scopes);
        return this.jwt(apiToken)
    }

    /**
     * Generates a JWT
     * @param apiToken 
     * @returns 
     */
    jwt(apiToken: IApiTokenModel): string {
        if (!apiToken?.data?.userId) {
            throw new Error('Invalid token');
        }
        const payload = JWTTokenFactory.create(apiToken.data?.userId?.toString(), apiToken.data?.token);
        return createJwt(this.config.jwtSecret, payload, `${this.config.expiresInMinutes}m`);
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
        if (apiToken?.data?.revokedAt) {
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
        try {
            const decoded = decodeJwt(this.config.jwtSecret, token);

            const apiToken = await this.apiTokenRepository.findOneActiveToken(decoded.token)

            if (!apiToken) {
                throw new UnauthorizedError()
            }

            const user = await this.userRepository.findById(decoded.uid)

            if (!user) {
                throw new UnauthorizedError()
            }

            return apiToken
        }
        catch (err) {
            if(err instanceof JsonWebTokenError) {
                throw new UnauthorizedError()
            }
        }

        return null
    }

    /**
     * Attempt login with credentials
     * @param email 
     * @param password 
     * @returns 
     */
    async attemptCredentials(email: string, password: string, scopes: string[] = []): Promise<string> {
        const user = await this.userRepository.findOneByEmail(email) as IUserModel;

        if (!user?.data?.id) {
            throw new UnauthorizedError()
        }

        if (user?.data?.hashedPassword && !comparePassword(password, user.data?.hashedPassword)) {
            throw new UnauthorizedError()
        }

        return this.createJwtFromUser(user, scopes)
    }

    /**
     * Returns the auth routes
     * 
     * @returns an array of IRoute objects, or null if auth routes are disabled
     */
    getAuthRoutes(): IRoute[] | null {
        if (!this.config.enableAuthRoutes) {
            return null
        }

        const routes = authRoutes(this.config);

        if (!this.config.enableAuthRoutesAllowCreate) {
            return routes.filter((route) => route.name !== 'authCreate');
        }

        return routes;
    }

}