import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import EventRegistry from "@src/core/domains/events/registry/EventRegistry";
 
class UserCreatedListener extends BaseEventListener {

    /**
     * Optional method to execute before the subscribers are dispatched.
     */
    async execute(): Promise<void> {

        // const payload = this.getPayload<IUserData>();

        // Handle logic
    }

}

export default EventRegistry.register(UserCreatedListener);