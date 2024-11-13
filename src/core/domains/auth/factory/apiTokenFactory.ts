import Factory from '@src/core/base/Factory'
import { IApiTokenFactory } from '@src/core/domains/auth/interfaces/IApiTokenFactory'
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel'
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'
import { ICtor } from '@src/core/interfaces/ICtor'

/**
 * Factory for creating ApiToken models.
 */
class ApiTokenFactory extends Factory<IApiTokenModel> implements IApiTokenFactory {

    constructor(modelCtor: ICtor<IApiTokenModel>) {
        super(modelCtor)
    }

    /**
     * Creates a new ApiToken model from the User
     *
     * @param {IUserModel} user
     * @returns {IApiTokenModel}
     */
    createFromUser(user: IUserModel, scopes: string[] = []): IApiTokenModel {
        return this.createWithData({
            userId: user.attributes?.id,
            token: tokenFactory(),
            scopes: scopes,
            revokedAt: null,
        })
    }

}

export default ApiTokenFactory
