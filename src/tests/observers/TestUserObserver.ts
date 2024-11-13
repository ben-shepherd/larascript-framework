import UserObserver from "@src/app/observers/UserObserver";
import { TestUserCreatedListener } from "@src/tests/events/events/auth/TestUserCreatedListener";

/**
 * Observer for the User model.
 * 
 * Automatically hashes the password on create/update if it is provided.
 */
export default class TestUserObserver extends UserObserver {

    constructor() {
        super();
        this.setUserCreatedListener(TestUserCreatedListener);
    }
    
}