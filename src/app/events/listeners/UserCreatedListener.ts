import { IUserData } from "@src/app/models/auth/User";
import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
 
export class UserCreatedListener extends BaseEventListener {

    // eslint-disable-next-line no-unused-vars
    async execute(payload: IUserData): Promise<void> {
        // Handle some logic
    }

}