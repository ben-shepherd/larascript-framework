import UserFactory from "@src/app/factory/UserFactory";
import AuthUser, { AuthUserAttributes } from "@src/core/domains/auth/models/AuthUser";
import UserObserver from "@src/core/domains/auth/observers/UserObserver";

/**
 * User structure
 */
export interface UserAttributes extends AuthUserAttributes {
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
export default class User extends AuthUser<UserAttributes> {

    public static EMAIL = 'email'

    public static FIRST_NAME = 'firstName'

    public static LAST_NAME = 'lastName'

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
        User.HASHED_PASSWORD,
        User.PASSWORD,
        User.ROLES,
        User.GROUPS,
    ];

    /**
     * The fields that are allowed to be set directly
     *
     * These fields can be set directly on the model.
     */
    fields: string[] = [
        User.EMAIL,
        User.PASSWORD,
        User.HASHED_PASSWORD,
        User.ROLES,
        User.FIRST_NAME,
        User.LAST_NAME,
        User.CREATED_AT,
        User.UPDATED_AT
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
     * Retrieves the factory for the model.
     * 
     * @returns The factory for the model.
     */
    getFactory(): UserFactory {
        return new UserFactory();
    }

}
