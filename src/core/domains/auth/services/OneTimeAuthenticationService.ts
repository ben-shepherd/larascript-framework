import { ApiTokenModelOptions, IApiTokenModel } from "@src/core/domains/auth/interfaces/models/IApiTokenModel";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { auth } from "@src/core/domains/auth/services/AuthService";
import { IOneTimeAuthenticationService } from "@src/core/domains/auth/interfaces/service/oneTimeService";

type SingleUseTokenOptions = Required<Pick<ApiTokenModelOptions, 'expiresAfterMinutes'>>

/**
 * Service for handling one-time authentication tokens.
 * This service provides functionality for creating and validating single-use tokens
 * that can be used for one-time authentication scenarios.
 */
class OneTimeAuthenticationService implements IOneTimeAuthenticationService {

    /**
     * Gets the scope identifier for one-time authentication.
     * @returns {string} The scope identifier 'oneTime'
     */
    public static getScope(): string {
        return 'oneTime'
    }

    /**
     * Gets the scope identifier for one-time authentication.
     * @returns {string} The scope identifier 'oneTime'
     */
    getScope(): string {
        return OneTimeAuthenticationService.getScope()
    }

    /**
     * Creates a single-use token for a user with specified scopes and expiration options.
     * @param {IUserModel} user - The user model for which to create the token
     * @param {string[]} [scopes=[]] - Additional scopes to include in the token
     * @param {SingleUseTokenOptions} [options={ expiresAfterMinutes: 15 }] - Options for token creation
     * @returns {Promise<string>} A promise that resolves to the created JWT token
     */
    async createSingleUseToken(user: IUserModel, scopes: string[] = [], options: SingleUseTokenOptions = { expiresAfterMinutes: 15 }): Promise<string> {
        const scope = OneTimeAuthenticationService.getScope()

        return await auth().getJwtAdapter().createJwtFromUser(user, [
            ...scopes,
            scope,
        ], {
            ...options,
        })
    }

    /**
     * Validates if a given API token has the one-time authentication scope.
     * @param {IApiTokenModel} apiToken - The API token to validate
     * @returns {boolean} True if the token has the one-time authentication scope, false otherwise
     */
    validateSingleUseToken(apiToken: IApiTokenModel): boolean {
        const targetScope = OneTimeAuthenticationService.getScope()
        return apiToken.hasScope(targetScope, true)
    }

}

export default OneTimeAuthenticationService