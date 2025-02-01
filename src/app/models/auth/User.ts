import UserObserver from "@src/app/observers/UserObserver";
import UserFactory from "@src/core/domains/auth/factory/userFactory";
import IUserModel from "@src/core/domains/auth/interfaces/IUserModel";
import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from "@src/core/models/base/Model";

/**
 * User structure
 */
export interface UserAttributes extends IModelAttributes {
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
export default class User extends Model<UserAttributes> implements IUserModel {

    factory = UserFactory;

    public table: string = 'users';

    constructor(data: UserAttributes | null = null) {
        super(data);
        this.setObserverConstructor(UserObserver);
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
     * Retrieves the fields defined on the model, minus the password field.
     * As this is a temporary field and shouldn't be saved to the database.
     * 
     * @returns The list of fields defined on the model.
     */
    getFields(): string[] {
        return super.getFields().filter(field => !['password'].includes(field));
    }

    /**
     * Checks if the user has the given role
     *
     * @param role The role to check
     * @returns True if the user has the role, false otherwise
     */
    hasRole(roles: string | string[]): boolean {
        roles = typeof roles === 'string' ? [roles] : roles;
        const userRoles = this.getAttributeSync('roles') ?? [];

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
        const userGroups = this.getAttributeSync('groups') ?? [];

        for(const group of groups) {
            if(!userGroups.includes(group)) return false;
        }

        return true;
    }

}
