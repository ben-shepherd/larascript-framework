import UserModel from '../models/UserModel'
import ApiToken from '../models/ApiTokenModel'
import tokenFactory from '../utils/generateToken'


export default (user: UserModel): ApiToken => {
    return new ApiToken({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}