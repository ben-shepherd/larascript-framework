import ApiToken from '@src/app/models/auth/ApiToken'
import Factory from '@src/core/base/Factory'
import { IApiTokenFactory } from '@src/core/domains/auth/interfaces/IApiTokenFactory'
import IApiTokenModel from '@src/core/domains/auth/interfaces/IApitokenModel'
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel'
import tokenFactory from '@src/core/domains/auth/utils/generateToken'
import { generateUuidV4 } from '@src/core/util/uuid/generateUuidV4'

/**
 * Factory for creating ApiToken models.
 */
class ApiTokenFactory extends Factory<IApiTokenModel> implements IApiTokenFactory {

    protected model = ApiToken

    getDefinition(): ApiToken['attributes'] {
        return {
            userId: this.faker.string.uuid(),
            token: generateUuidV4(),
            scopes: [],
            revokedAt: null,
        } as unknown as ApiToken['attributes']
    }


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
