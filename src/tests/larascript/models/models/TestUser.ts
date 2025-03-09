import User, { UserAttributes } from "@src/app/models/auth/User";
import { IModelEvents } from "@src/core/domains/models/interfaces/IModel";
import TestUserCreatedListener from "@src/tests/larascript/events/events/auth/TestUserCreatedListener";


/**
 * User model
 *
 * Represents a user in the database.
 */
export default class TestUser extends User {

    public table: string = 'users';

    constructor(data: UserAttributes | null = null) {
        super(data);
    }

    protected events?: IModelEvents | undefined = {
        created: TestUserCreatedListener
    }

}
 