import User, { IUserData } from "@src/app/models/auth/User";
import TestUserObserver from "@src/tests/observers/TestUserObserver";


/**
 * User model
 *
 * Represents a user in the database.
 */
export default class TestUser extends User {

    public table: string = 'users';

    constructor(data: IUserData | null = null) {
        super(data);
        this.setObserverConstructor(TestUserObserver)
    }

}
 