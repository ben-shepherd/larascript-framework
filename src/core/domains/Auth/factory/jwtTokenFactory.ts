import { JWTToken } from "@src/core/domains/auth/types/Types.t";

export default (userId: string, token: string): JWTToken => {
    return {
        uid: userId,
        token
    }
}