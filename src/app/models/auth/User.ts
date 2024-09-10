import ApiToken from "@src/app/models/auth/ApiToken";
import UserObserver from "@src/app/observers/UserObserver";
import Model from "@src/core/base/Model";
import IUserModel, { IUserData } from "@src/core/domains/auth/interfaces/IUserModel";

/**
 * User model
 *
 * Represents a user in the database.
 */
export default class User extends Model<IUserData> implements IUserModel {

    /**
     * Table name
     */
    public table: string = 'users';

    /**
     * @param data User data
     */
    constructor(data: IUserData | null = null) {
        super(data);
        this.observeWith(UserObserver);
    }

    /**
     * Guarded fields
     *
     * These fields cannot be set directly.
     */
    guarded: string[] = [
        'hashedPassword',
        'password',
        'roles'
    ];

    /**
     * The fields that are allowed to be set directly
     *
     * These fields can be set directly on the model.
     */
    fields: string[] = [
        'email',
        'password',
        'hashedPassword',
        'roles',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
    ]

    /**
     * Fields that should be returned as JSON
     *
     * These fields will be returned as JSON when the model is serialized.
     */
    json = [
        'roles'
    ]

    /**
     * @returns The tokens associated with this user
     *
     * Retrieves the ApiToken models associated with this user.
     */
    async tokens(active: boolean = true): Promise<ApiToken[]> {
        const filters = active ? { revokedAt: null } : {};

        return this.hasMany(ApiToken, {
            localKey: 'id',
            foreignKey: 'userId',
            filters
        }) 
    }
}
