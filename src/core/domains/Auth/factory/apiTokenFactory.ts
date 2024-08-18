import ApiToken, { ApiTokenData } from '@app/models/auth/ApiToken'
import Factory from '@src/core/base/Factory'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'
import IUserModel from '../interfaces/IUserModel'

class ApiTokenFactory extends Factory<ApiToken, ApiTokenData>
{
    constructor() {
        super(ApiToken)
    }
    
    createFromUser(user: IUserModel): ApiToken {
        return new this.modelCtor({
            userId: user.data?._id,
            token: tokenFactory(),
            revokedAt: null,
        })
    }
}

export default ApiTokenFactory