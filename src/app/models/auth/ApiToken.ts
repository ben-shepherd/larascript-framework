import User from '@src/app/models/auth/User';
import ApiTokenObserver from '@src/app/observers/ApiTokenObserver';
import ApiTokenFactory from '@src/core/domains/auth/factory/apiTokenFactory';
import IApiTokenModel, { ApiTokenAttributes } from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import Scopes from '@src/core/domains/auth/services/Scopes';
import BelongsTo from '@src/core/domains/eloquent/relational/BelongsTo';
import { ModelConstructor } from '@src/core/interfaces/IModel';
import Model from '@src/core/models/base/Model';

/**
 * ApiToken model
 *
 * Represents an API token that can be used to authenticate a user.
 */
class ApiToken extends Model<ApiTokenAttributes> implements IApiTokenModel {

    public factory = ApiTokenFactory;

    public table: string = 'api_tokens';


    /**
     * The user model constructor
     */

    protected userModelCtor: ModelConstructor<IUserModel> = User

    /**
     * Required ApiToken fields
     *
     * @field userId The user this token belongs to
     * @field token The token itself
     * @field revokedAt The date and time the token was revoked (null if not revoked)
     */
    public fields: string[] = [
        'userId',
        'token',
        'scopes',
        'revokedAt'
    ]

    public json: string[] = [
        'scopes'
    ]

    public relationships: string[] = [
        'user'
    ]

    public timestamps: boolean = false;

    /**
     * Construct an ApiToken model from the given data.
     *
     * @param {ApiTokenAttributes} [data=null] The data to construct the model from.
     *
     * @constructor
     */
    constructor(data: ApiTokenAttributes | null = null) {
        super(data)
        this.setObserverConstructor(ApiTokenObserver)
    }

    /**
     * Sets the user model constructor to use for fetching the user of this ApiToken
     * @param {ModelConstructor<IUserModel>} userModelCtor The user model constructor
     */
    setUserModelCtor(userModelCtor: ModelConstructor<IUserModel>): void {
        this.userModelCtor = userModelCtor
    }

    /**
     * Retrieves the constructor for the user model associated with this ApiToken.
     * @returns {ModelConstructor<IUserModel>} The user model constructor.
     */
    getUserModelCtor(): ModelConstructor<IUserModel> {
        return this.userModelCtor
    }

    /**
     * Fetches the user that this ApiToken belongs to.
     *
     * @returns A BelongsTo relationship that resolves to the user model.
     */
    user(): BelongsTo {
        return this.belongsTo(this.userModelCtor, {
            localKey: 'userId',
            foreignKey: 'id',
        })
    }

    /**
     * Checks if the given scope(s) are present in the scopes of this ApiToken
     * @param scopes The scope(s) to check
     * @returns True if all scopes are present, false otherwise
     */
    hasScope(scopes: string | string[], exactMatch: boolean = true): boolean {
        const currentScopes = this.getAttributeSync('scopes') ?? [];
       
        if(exactMatch) {
            return Scopes.exactMatch(currentScopes, scopes);
        }

        return Scopes.partialMatch(currentScopes, scopes);
    }

}

export default ApiToken
