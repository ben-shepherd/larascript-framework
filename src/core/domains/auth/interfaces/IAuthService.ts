/* eslint-disable no-unused-vars */
import IApiTokenModel from "@src/core/domains/auth/interfaces/IApitokenModel";
import IApiTokenRepository from "@src/core/domains/auth/interfaces/IApiTokenRepository";
import { IAuthConfig } from "@src/core/domains/auth/interfaces/IAuthConfig";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import IUserRepository from "@src/core/domains/auth/interfaces/IUserRepository";
import { IRoute } from "@src/core/domains/express/interfaces/IRoute";
import IService from "@src/core/interfaces/IService";


/**
 * The service that handles authentication.
 *
 * @export
 * @interface IAuthService
 * @extends {IService}
 */
export interface IAuthService extends IService {

    /**
     * The auth config
     *
     * @type {any}
     * @memberof IAuthService
     */
    config: IAuthConfig;

    /**
     * The user repository
     *
     * @type {IUserRepository}
     * @memberof IAuthService
     */
    userRepository: IUserRepository;

    /**
     * The api token repository
     *
     * @type {IApiTokenRepository}
     * @memberof IAuthService
     */
    apiTokenRepository: IApiTokenRepository;

    /**
     * Attempt to authenticate a user using a JWT token.
     *
     * @param {string} token The JWT token
     * @returns {Promise<IApiTokenModel | null>} The authenticated user, or null if not authenticated
     * @memberof IAuthService
     */
    attemptAuthenticateToken: (token: string) => Promise<IApiTokenModel | null>;

    /**
     * Creates a JWT for the user.
     *
     * @param {IUserModel} user The user
     * @returns {Promise<string>} The JWT token
     * @memberof IAuthService
     */
    createJwtFromUser: (user: IUserModel, scopes?: string[]) => Promise<string>;

    /**
     * Creates a new ApiToken model from the User
     *
     * @param {IUserModel} user The user
     * @returns {Promise<IApiTokenModel>} The new ApiToken model
     * @memberof IAuthService
     */
    createApiTokenFromUser: (user: IUserModel, scopes?: string[]) => Promise<IApiTokenModel>;

    /**
     * Revokes a token.
     *
     * @param {IApiTokenModel} apiToken The ApiToken model
     * @returns {Promise<void>}
     * @memberof IAuthService
     */
    revokeToken: (apiToken: IApiTokenModel) => Promise<void>;

    /**
     * Attempt to authenticate a user using their credentials.
     *
     * @param {string} email The user's email
     * @param {string} password The user's password
     * @returns {Promise<string>} The JWT token
     * @memberof IAuthService
     */
    attemptCredentials: (email: string, password: string, scopes?: string[]) => Promise<string>;

    /**
     * Generates a JWT.
     *
     * @param {IApiTokenModel} apiToken The ApiToken model
     * @returns {string} The JWT token
     * @memberof IAuthService
     */
    jwt: (apiToken: IApiTokenModel) => string;

    /**
     * Returns the auth routes.
     *
     * @returns {IRoute[] | null} An array of routes, or null if auth routes are disabled
     * @memberof IAuthService
     */
    getAuthRoutes(): IRoute[] | null;
}
