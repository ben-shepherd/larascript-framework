import ApiToken from '@app/models/auth/ApiToken'
import Factory from '@src/core/base/Factory'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'
import IApiTokenModel, { IApiTokenData } from '../interfaces/IApitokenModel'
import IUserModel from '../interfaces/IUserModel'

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