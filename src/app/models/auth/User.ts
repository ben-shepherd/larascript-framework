import ApiToken from "@src/app/models/auth/ApiToken";
import UserObserver from "@src/app/observers/UserObserver";
import Model from "@src/core/base/Model";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import IModelData from "@src/core/interfaces/IModelData";

/**
 * User structure
 */
export interface IUserData extends IModelData {
    email: string;
    password?: string;
    hashedPassword: string;
    roles: string[];
    groups: string[];
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

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
        'roles',
        'groups',
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
        'groups',
        'roles'
    ]

    /**
     * Checks if the user has the given role
     *
     * @param role The role to check
     * @returns True if the user has the role, false otherwise
     */
    hasRole(roles: string | string[]): boolean {
        roles = typeof roles === 'string' ? [roles] : roles;
        const userRoles = this.getAttribute('roles') ?? [];

        for(const role of roles) {
            if(!userRoles.includes(role)) return false;
        }

        return true;
    }

    /**
     * Checks if the user has the given role
     *
     * @param role The role to check
     * @returns True if the user has the role, false otherwise
     */
    hasGroup(groups: string | string[]): boolean {
        groups = typeof groups === 'string' ? [groups] : groups;
        const userGroups = this.getAttribute('groups') ?? [];

        for(const group of groups) {
            if(!userGroups.includes(group)) return false;
        }

        return true;
    }

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
