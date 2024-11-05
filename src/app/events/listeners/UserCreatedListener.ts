import { IUserData } from "@src/app/models/auth/User";
import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
 
export class UserCreatedListener extends BaseEventListener {

     
    async execute(): Promise<void> {

        // eslint-disable-next-line no-unused-vars
        const userData = this.getPayload<IUserData>();

        // Handle some logic
    }

}