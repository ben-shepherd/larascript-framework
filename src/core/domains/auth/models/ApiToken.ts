import User from '@src/app/models/auth/User';
import ApiTokenObserver from '@src/app/observers/ApiTokenObserver';
import { IApiTokenModel } from '@src/core/domains/auth/interfaces/models/IApiTokenModel';
import { IUserModel } from '@src/core/domains/auth/interfaces/models/IUserModel';
import Scopes from '@src/core/domains/auth/services/Scopes';
import BelongsTo from '@src/core/domains/eloquent/relational/BelongsTo';
import { IModelAttributes, ModelConstructor } from '@src/core/interfaces/IModel';
import Model from '@src/core/models/base/Model';

export interface ApiTokenAttributes extends IModelAttributes {
    userId: string;
    token: string;
    scopes: string[];
    revokedAt: Date | null;
    user: IUserModel | null;
}

/**
 * ApiToken model
 *
 * Represents an API token that can be used to authenticate a user.
 */
class ApiToken extends Model<ApiTokenAttributes> implements IApiTokenModel {

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
     * Get the user id
     * @returns {string} The user id
     */
    getUserId(): string {
        return this.getAttributeSync('userId') as string
    }

    /**
     * Set the user id
     * @param {string} userId The user id
     * @returns {Promise<void>} A promise that resolves when the user id is set
     */
    setUserId(userId: string): Promise<void> {
        return this.setAttribute('userId', userId)
    }

    /**
     * Get the token
     * @returns {string} The token
     */
    getToken(): string {
        return this.getAttributeSync('token') as string
    }
    
    /**
     * Set the token
     * @param {string} token The token
     * @returns {Promise<void>} A promise that resolves when the token is set
     */
    setToken(token: string): Promise<void> {
        return this.setAttribute('token', token)
    }

    /**
     * Get the revoked at
     * @returns {Date | null} The revoked at
     */
    getRevokedAt(): Date | null {
        return this.getAttributeSync('revokedAt') as Date | null
    }

    /**
     * Set the revoked at
     * @param {Date | null} revokedAt The revoked at
     * @returns {Promise<void>} A promise that resolves when the revoked at is set
     */
    setRevokedAt(revokedAt: Date | null): Promise<void> {
        return this.setAttribute('revokedAt', revokedAt)
    }
    
    /**
     * Get the scopes
     * @returns {string[]} The scopes
     */
    getScopes(): string[] {
        return this.getAttributeSync('scopes') as string[]
    }

    /**
     * Set the scopes
     * @param {string[]} scopes The scopes
     * @returns {Promise<void>} A promise that resolves when the scopes are set
     */
    setScopes(scopes: string[]): Promise<void> {
        return this.setAttribute('scopes', scopes)
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
