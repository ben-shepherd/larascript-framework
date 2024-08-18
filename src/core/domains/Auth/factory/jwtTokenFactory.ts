import { IJSonWebToken } from "@src/core/domains/auth/interfaces/IJSonWebToken"

class JWTTokenFactory {
    create(userId: string, token: string): IJSonWebToken {
        return {
            uid: userId,
            token
        }
    }
}

export default JWTTokenFactory