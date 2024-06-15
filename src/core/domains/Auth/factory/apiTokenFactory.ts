import { ModelConstructor } from '@src/core/interfaces/IModel'
import ApiToken from '../models/BaseApiTokenModel'
import BaseUserModel from '../models/BaseUserModel'
import tokenFactory from '../utils/generateToken'

export default <M extends ApiToken = ApiToken>(user: BaseUserModel, modelCtor: ModelConstructor<M>): M => {
    if(!user?.data?._id) {
        throw new Error('Expected user to have an id')
    }

    return new modelCtor({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}