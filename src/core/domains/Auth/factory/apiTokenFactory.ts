import BaseUserModel from '../models/BaseUserModel'
import ApiToken from '../models/ApiTokenModel'
import tokenFactory from '../utils/generateToken'


export default (user: BaseUserModel): ApiToken => {
    if(!user?.data?._id) {
        throw new Error('Expected user to have an id')
    }

    return new ApiToken({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}