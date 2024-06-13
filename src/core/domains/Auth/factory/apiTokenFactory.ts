import BaseUserModel from '../models/BaseUserModel'
import ApiToken from '../models/BaseApiTokenModel'
import tokenFactory from '../utils/generateToken'

type Constructor<M> = new (...args: any[]) => M

export default <M extends ApiToken = ApiToken>(user: BaseUserModel, modelCtor: Constructor<M>): ApiToken => {
    if(!user?.data?._id) {
        throw new Error('Expected user to have an id')
    }

    return new modelCtor({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}