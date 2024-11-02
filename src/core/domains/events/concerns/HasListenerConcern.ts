import { IBroadcaster } from "@src/core/domains/broadcast/interfaces/IBroadcaster"
import { IHasListenerConcern } from "@src/core/domains/events/interfaces/IHasListenerConcern"
import { ICtor } from "@src/core/interfaces/ICtor"

const HasListenerConcern = (Base: ICtor<IBroadcaster>) => {
    return class HasListener extends Base implements IHasListenerConcern {

        constructor() {
            super();
        }


    }
}

export default HasListenerConcern