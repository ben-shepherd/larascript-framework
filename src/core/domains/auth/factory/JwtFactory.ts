import { IJSonWebToken } from "@src/core/domains/auth/interfaces/jwt/IJsonWebToken"


/**
 * Factory for creating JWT tokens.
 *
 * @class JWTTokenFactory
 */
export default class JwtFactory {

    /**
     * Creates a new JWT token from a user ID and token.
     *
     * @param {string} userId - The user ID.
     * @param {string} token - The token.
     * @returns {IJSonWebToken} A new JWT token.
     */
    static createUserIdAndPayload(userId: string, token: string): IJSonWebToken {
        return {
            uid: userId,
            token
        }
    }

}


