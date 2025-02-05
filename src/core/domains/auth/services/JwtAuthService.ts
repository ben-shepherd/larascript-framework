import { app } from "@src/core/services/App";
import { JsonWebTokenError } from "jsonwebtoken";

import UnauthorizedError from "../../auth-legacy/exceptions/UnauthorizedError";
import decodeJwt from "../../auth-legacy/utils/decodeJwt";
import { IRouter } from "../../http/interfaces/IRouter";
import Route from "../../http/router/Route";
import BaseAuthAdapter from "../base/BaseAuthAdapter";
import AuthController from "../controllers/AuthController";
import InvalidSecretException from "../exceptions/InvalidJwtSettings";
import JwtFactory from "../factory/JwtFactory";
import { IAclConfig } from "../interfaces/acl/IAclConfig";
import { IACLService } from "../interfaces/acl/IACLService";
import { IJwtAuthService } from "../interfaces/jwt/IJwtAuthService";
import { IJwtConfig } from "../interfaces/jwt/IJwtConfig";
import { IApiTokenModel } from "../interfaces/models/IApiTokenModel";
import { IUserModel } from "../interfaces/models/IUserModel";
import { IApiTokenRepository } from "../interfaces/repository/IApiTokenRepository";
import { IUserRepository } from "../interfaces/repository/IUserRepository";
import AuthorizeMiddleware from "../middleware/AuthorizeMiddleware";
import ApiToken from "../models/ApiToken";
import ApiTokenRepository from "../repository/ApiTokenRepitory";
import UserRepository from "../repository/UserRepository";
import comparePassword from "../utils/comparePassword";
import createJwt from "../utils/createJwt";
import generateToken from "../utils/generateToken";
import ACLService from "./ACLService";

/**
 * Short hand for app('auth.jwt')
 */
export const authJwt = () => app('auth.jwt')

/**
 * JwtAuthService is an authentication adapter that implements JWT (JSON Web Token) based authentication.
 * It extends BaseAuthAdapter and provides JWT-specific authentication functionality.
 * 
 * This service:
 * - Handles JWT token creation and validation
 * - Manages user authentication via email/password credentials
 * - Provides API token management for machine-to-machine auth
 * - Configures auth-related routes and middleware
 * - Integrates with the application's ACL (Access Control List) system
 * 
 * The service can be accessed via the 'auth.jwt' helper:
 * ```ts
 * const jwtAuth = authJwt();
 * const token = await jwtAuth.attemptCredentials(email, password);
 * ```
 */
class JwtAuthService extends BaseAuthAdapter<IJwtConfig> implements IJwtAuthService {

    private apiTokenRepository!: IApiTokenRepository
    
    private userRepository!: IUserRepository

    protected aclService!: IACLService

    constructor(config: IJwtConfig, aclConfig: IAclConfig) {
        super(config, aclConfig);
        this.apiTokenRepository = new ApiTokenRepository()
        this.userRepository = new UserRepository()
        this.aclService = new ACLService(aclConfig)
    }

    /**
     * Get the JWT secret
     * 
     * @returns 
     */
    private getJwtSecret(): string {
        if(!this.config.settings.secret) {
            throw new InvalidSecretException()
        }
        return this.config.settings.secret
    }

    /**
     * Get the JWT expires in minutes
     * 
     * @returns 
     */

    private getJwtExpiresInMinutes(): number {
        if(!this.config.settings.expiresInMinutes) {
            throw new InvalidSecretException()
        }
        return this.config.settings.expiresInMinutes
    }

    /**
     * Attempt login with credentials
     * @param email 
     * @param password 
     * @returns 
     */
    async attemptCredentials(email: string, password: string, scopes: string[] = []): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
    
        if (!user) {
            throw new UnauthorizedError()
        }
    
        const hashedPassword = user.getAttributeSync('hashedPassword') as string | null

        if(!hashedPassword) {
            throw new UnauthorizedError()
        }
    
        if (!comparePassword(password, hashedPassword)) {
            throw new UnauthorizedError()
        }

        // Generate the api token
        const apiToken = await this.buildApiTokenByUser(user, scopes)
        await apiToken.save()

        // Generate the JWT token
        return this.generateJwt(apiToken)
    }

    /**
     * Create a new ApiToken model from the User
     * @param user 
     * @returns 
     */
    protected async buildApiTokenByUser(user: IUserModel, scopes: string[] = []): Promise<IApiTokenModel> {
        const apiToken = ApiToken.create<IApiTokenModel>()
        apiToken.setUserId(user.id as string)
        apiToken.setToken(generateToken())
        apiToken.setScopes([...this.aclService.getRoleScopesFromUser(user), ...scopes])
        apiToken.setRevokedAt(null)
        return apiToken
    }


    /**
     * Generate a JWT token
     * @param apiToken 
     * @returns 
     */
    protected generateJwt(apiToken: IApiTokenModel) {
        if (!apiToken?.userId) {
            throw new Error('Invalid token');
        }

        // Create the payload
        const payload = JwtFactory.createUserIdAndPayload(apiToken.getUserId(), apiToken.getToken());

        // Get the expires in minutes. Example: 1m
        const expiresIn = `${this.getJwtExpiresInMinutes()}m`

        // Create the JWT token
        return createJwt(this.getJwtSecret(), payload, expiresIn)
    }

    /**
     * Attempt authentication against a JWT

     * @param token 
     * @returns 
     */
    async attemptAuthenticateToken(token: string): Promise<IApiTokenModel | null> {
        try {
            const { token: decodedToken, uid: decodedUserId } = decodeJwt(this.getJwtSecret(), token);

            const apiToken = await this.apiTokenRepository.findOneActiveToken(decodedToken)
    
            if (!apiToken) {
                throw new UnauthorizedError()
            }
    
            const user = await this.userRepository.findById(decodedUserId)
    
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
     * Revokes a token
     * @param apiToken 
     * @returns 
     */
    async revokeToken(apiToken: IApiTokenModel): Promise<void> {
        if (apiToken?.revokedAt) {
            return;
        }
    
        await this.apiTokenRepository.revokeToken(apiToken)
    }

    /**
     * Revokes all tokens for a user
     * @param userId 
     * @returns 
     */
    async revokeAllTokens(userId: string | number): Promise<void> {
        await this.apiTokenRepository.revokeAllTokens(userId)
    }

    /**
     * Get the router
     * @returns 
     */
    getRouter(): IRouter {
        return Route.group({
            prefix: '/auth',
            config: {
                adapter: 'jwt'
            }
        }, (router) => {
            router.post('/login', [AuthController, 'login']);
            router.post('/register', [AuthController, 'register']);
            router.post('/logout', [AuthController, 'logout']);

            router.group({
                middlewares: [AuthorizeMiddleware]
            }, (router) => {
                router.get('/user', [AuthController, 'user']);
                router.get('/refresh', [AuthController, 'refresh']);
            })
        })
    }

    /**
     * Get the user repository
     * @returns The user repository
     */
    public getUserRepository(): IUserRepository {
        return new UserRepository(this.config.models.user);
    }

}




export default JwtAuthService;
