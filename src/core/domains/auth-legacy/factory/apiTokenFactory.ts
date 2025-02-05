import Factory from '@src/core/base/Factory'
import { IApiTokenFactory } from '@src/core/domains/auth-legacy/interfaces/IApiTokenFactory'
import IApiTokenModel from '@src/core/domains/auth-legacy/interfaces/IApitokenModel'
import IUserModel from '@src/core/domains/auth-legacy/interfaces/IUserModel'
import tokenFactory from '@src/core/domains/auth-legacy/utils/generateToken'
import ApiToken from '@src/core/domains/auth/models/ApiToken'
import { IModel, IModelAttributes, ModelConstructor } from '@src/core/interfaces/IModel'

/**
 * Factory for creating ApiToken models.
 */
class ApiTokenFactory extends Factory<ApiToken> implements IApiTokenFactory {

    protected model: ModelConstructor<IModel<IModelAttributes>> = ApiToken;

    /**
     * Creates a new ApiToken model from the User
     *
     * @param {IUserModel} user
     * @returns {IApiTokenModel}

     */
    createFromUser(user: IUserModel, scopes: string[] = []): IApiTokenModel {
        return this.create({
            userId: user?.id,
            token: tokenFactory(),
            scopes: scopes,
            revokedAt: null,
        })
    }

}

export default ApiTokenFactory
