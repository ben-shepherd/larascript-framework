import { JWTToken } from "@src/core/domains/auth/types/types.t";

export default (userId: string, token: string): JWTToken => {
    return {
        uid: userId,
        token
    }
}