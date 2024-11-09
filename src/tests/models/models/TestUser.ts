import User, { IUserData } from "@src/app/models/auth/User";
import TestUserObserver from "@src/tests/observers/TestUserObserver";


/**
 * User model
 *
 * Represents a user in the database.
 */
export default class TestUser extends User {

    public table: string = (new User).table;

    constructor(data: IUserData | null = null) {
        super(data);
        this.observeWith(TestUserObserver, true)
    }

}
 