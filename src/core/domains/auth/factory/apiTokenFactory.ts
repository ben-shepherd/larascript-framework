import ApiToken from '@src/app/models/auth/ApiToken'
import Factory from '@src/core/base/Factory'
import IApiTokenModel, { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel'
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'

/**
 * Factory for creating ApiToken models.
 *
 * @class ApiTokenFactory
 * @extends {Factory<IApiTokenModel, IApiTokenData>}
 */
class ApiTokenFactory extends Factory<IApiTokenModel, IApiTokenData> {

    constructor() {
        super(ApiToken)
    }

    /**
     * Creates a new ApiToken model from the User
     *
     * @param {IUserModel} user
     * @returns {IApiTokenModel}
     */
    createFromUser(user: IUserModel, scopes: string[] = []): IApiTokenModel {
        return new this.modelCtor({
            userId: user.data?.id,
            token: tokenFactory(),
            scopes: scopes,
            revokedAt: null,
        })
    }

}

export default ApiTokenFactory
