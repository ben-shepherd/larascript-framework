import UserObserver from "@src/app/observers/UserObserver";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
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

    /**
     * Table name
     */
    public table: string = 'users';

    /**
     * @param data User data
     */
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

    getEmail(): string | null {
        return this.getAttributeSync('email');
    }


    setEmail(email: string): Promise<void> {
        return this.setAttribute('email', email);
    }

    getHashedPassword(): string | null {
        return this.getAttributeSync('hashedPassword');
    }

    setHashedPassword(hashedPassword: string): Promise<void> {
        return this.setAttribute('hashedPassword', hashedPassword);
    }

    getRoles(): string[] {
        return this.getAttributeSync('roles') ?? [];
    }

    setRoles(roles: string[]): Promise<void> {
        return this.setAttribute('roles', roles);
    }

    getGroups(): string[] {
        return this.getAttributeSync('groups') ?? [];
    }

    setGroups(groups: string[]): Promise<void> {
        return this.setAttribute('groups', groups);
    }

}
