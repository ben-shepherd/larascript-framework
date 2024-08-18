import ApiToken from '@src/app/models/auth/ApiToken'
import Factory from '@src/core/base/Factory'
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'
import IApiTokenModel, { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel'

class ApiTokenFactory extends Factory<IApiTokenModel, IApiTokenData>
{
    constructor() {
        super(ApiToken)
    }
    
    createFromUser(user: IUserModel): IApiTokenModel {
        return new this.modelCtor({
            userId: user.data?._id,
            token: tokenFactory(),
            revokedAt: null,
        })
    }
}

export default ApiTokenFactory