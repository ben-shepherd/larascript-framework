import User, { UserAttributes } from "@src/app/models/auth/User";
import TestUserObserver from "@src/tests/observers/TestUserObserver";


/**
 * User model
 *
 * Represents a user in the database.
 */
export default class TestUser extends User {

    public table: string = 'users';

    constructor(data: UserAttributes | null = null) {
        super(data);
        this.setObserverConstructor(TestUserObserver)
    }

}
 