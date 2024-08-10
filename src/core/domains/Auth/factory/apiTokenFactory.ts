import BaseApiToken from '@src/core/domains/Auth/models/BaseApiTokenModel'
import BaseUserModel from '@src/core/domains/Auth/models/BaseUserModel'
import tokenFactory from '@src/core/domains/Auth/utils/generateToken'
import { ModelConstructor } from '@src/core/interfaces/IModel'

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