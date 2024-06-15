import { ModelConstructor } from '@src/core/interfaces/IModel'
import BaseApiToken from '../models/BaseApiTokenModel'
import BaseUserModel from '../models/BaseUserModel'
import tokenFactory from '../utils/generateToken'

export default <
    Model extends BaseApiToken = BaseApiToken
> (user: BaseUserModel, modelCtor: ModelConstructor<Model>): Model => {
    
    if(!user?.data?._id) {
        throw new Error('Expected user to have an id')
    }

    return new modelCtor({
        userId: user.data?._id,
        token: tokenFactory(),
        revokedAt: null,
    })
}