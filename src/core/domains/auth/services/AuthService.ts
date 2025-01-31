import Service from '@src/core/base/Service';
import InvalidJWTSecret from '@src/core/domains/auth/exceptions/InvalidJWTSecret';
import UnauthorizedError from '@src/core/domains/auth/exceptions/UnauthorizedError';
import JWTTokenFactory from '@src/core/domains/auth/factory/jwtTokenFactory';
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel';
import IApiTokenRepository from '@src/core/domains/auth/interfaces/IApiTokenRepository';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import { IAuthService } from '@src/core/domains/auth/interfaces/IAuthService';
import { IPermissionGroup } from '@src/core/domains/auth/interfaces/IPermissionsConfig';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import IUserRepository from '@src/core/domains/auth/interfaces/IUserRepository';
import authRoutes from '@src/core/domains/auth/routes/auth';
import comparePassword from '@src/core/domains/auth/utils/comparePassword';
import createJwt from '@src/core/domains/auth/utils/createJwt';
import decodeJwt from '@src/core/domains/auth/utils/decodeJwt';
import { queryBuilder } from '@src/core/domains/eloquent/services/EloquentQueryBuilderService';
import { IRouter } from '@src/core/domains/express/interfaces/IRoute';
import { app } from '@src/core/services/App';
import { JsonWebTokenError } from 'jsonwebtoken';

import Router from '../../express/routing/Router';


/**
 * Shorthand for accessing the auth service
 * @returns 
 */
export const auth = () => app('auth');

/**
 * Auth service
 */
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
        const userScopes = this.getRoleScopes(user);
        const factory = new this.config.factory.apiTokenFactory(this.config.models.apiToken);
        const apiToken = factory.createFromUser(user, [...userScopes, ...scopes]);
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
        if (!apiToken?.userId) {
            throw new Error('Invalid token');
        }

        const userId = apiToken.getAttributeSync('userId')?.toString() ?? '';
        const token = apiToken.getAttributeSync('token') ?? '';

        const payload = JWTTokenFactory.create(userId, token);
        return createJwt(this.config.jwtSecret, payload, `${this.config.expiresInMinutes}m`);
    }

    /**
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
        if (apiToken?.revokedAt) {
            return;
        }

        await queryBuilder(this.apiTokenRepository.modelConstructor)
            .where('userId', apiToken.userId as string)
            .update({ revokedAt: new Date() });
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
        const user = await this.userRepository.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedError()
        }

        const hashedPassword = user.getAttributeSync('hashedPassword')

        if (hashedPassword && !comparePassword(password, hashedPassword)) {
            throw new UnauthorizedError()
        }

        return await this.createJwtFromUser(user, scopes)
    }

    /**
     * Returns the auth routes
     * 
     * @returns an array of IRoute objects, or a blank router if auth routes are disabled
     */
    getAuthRoutes(): IRouter {
        if (!this.config.enableAuthRoutes) {
            return new Router()
        }

        const router = authRoutes(this.config);

        /**
         * todo
         */
        if (!this.config.enableAuthRoutesAllowCreate) {
            router.setRegisteredRoutes(router.getRegisteredRoutes().filter((route) => route.name !== 'authCreate'));
        }

        return router;
    }

    /**
     * Retrieves the user repository instance.
     * @returns {IUserRepository} The user repository instance.
     */
    getUserRepository(): IUserRepository {
        return new this.config.repositories.user(this.config.models.user);
    }

    /**
     * Retrieves the groups from the roles
     * @param roles 
     * @returns 
     */
    getGroupsFromRoles(roles: string[] | string): IPermissionGroup[] {
        const rolesArray = typeof roles === 'string' ? [roles] : roles;
        const groups = this.config.permissions.groups;

        return groups.filter((group) => {
            const groupRoles = group.roles ?? [];
            return groupRoles.some((role) => rolesArray.includes(role))
        });
    }

    /**
     * Retrieves the scopes from the roles
     * @param user 
     * @returns 
     */
    getRoleScopes(user: IUserModel): string[] {
        const roles = user.getAttributeSync('roles') ?? [];
        const groups = this.getGroupsFromRoles(roles);
        let scopes: string[] = [];

        for(const group of groups) {
            scopes = [...scopes, ...(group.scopes ?? [])];
        }

        return scopes;
    }

}