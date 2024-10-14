import User from '@src/app/models/auth/User';
import ApiTokenObserver from '@src/app/observers/ApiTokenObserver';
import Model from '@src/core/base/Model';
import IApiTokenModel, { IApiTokenData } from '@src/core/domains/auth/interfaces/IApitokenModel';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import Scopes from '@src/core/domains/auth/services/Scopes';

/**
 * ApiToken model
 *
 * Represents an API token that can be used to authenticate a user.
 */
class ApiToken extends Model<IApiTokenData> implements IApiTokenModel {

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

    /**
     * Construct an ApiToken model from the given data.
     *
     * @param {IApiTokenData} [data=null] The data to construct the model from.
     *
     * @constructor
     */
    constructor(data: IApiTokenData | null = null) {
        super(data)
        this.observeWith(ApiTokenObserver)
    }

    /**
     * Disable createdAt and updatedAt timestamps
     */
    public timestamps: boolean = false;

    /**
     * Finds the related user for this ApiToken
     * @returns The user model if found, or null if not
     */
    public async user(): Promise<IUserModel | null> {
        return this.belongsTo(User, {
            localKey: 'userId',
            foreignKey: 'id',
        })
    }   

    /**
     * Checks if the given scope(s) are present in the scopes of this ApiToken
     * @param scopes The scope(s) to check
     * @returns True if all scopes are present, false otherwise
     */
    public hasScope(scopes: string | string[], exactMatch: boolean = true): boolean {
        const currentScopes = this.getAttribute('scopes') ?? [];
       
        if(exactMatch) {
            return Scopes.exactMatch(currentScopes, scopes);
        }

        return Scopes.partialMatch(currentScopes, scopes);
    }

}

export default ApiToken
