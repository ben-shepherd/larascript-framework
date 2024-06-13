import { JWTToken } from "../types/types.t";

export default (userId: string, token: string): JWTToken => {
    return {
        uid: userId,
        token
    }
}