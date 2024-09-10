import { IJSonWebToken } from "@src/core/domains/auth/interfaces/IJSonWebToken"

/**
 * Factory for creating JWT tokens.
 *
 * @class JWTTokenFactory
 */
export default class JWTTokenFactory {

    /**
     * Creates a new JWT token from a user ID and token.
     *
     * @param {string} userId - The user ID.
     * @param {string} token - The token.
     * @returns {IJSonWebToken} A new JWT token.
     */
    static create(userId: string, token: string): IJSonWebToken {
        return {
            uid: userId,
            token
        }
    }

}


