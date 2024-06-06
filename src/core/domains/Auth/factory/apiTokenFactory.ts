import BaseUserModel from '../models/BaseUserModel'
import ApiToken from '../models/ApiTokenModel'
import tokenFactory from '../utils/generateToken'


export default (user: BaseUserModel): ApiToken => {
    return new ApiToken({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}