
import BaseEvent from "@src/core/domains/events/base/BaseEvent";
import { IEventSubscriber } from "@src/core/domains/events/interfaces/IEventSubscriber";

class BaseEventSubscriber extends BaseEvent implements IEventSubscriber {

}

export default BaseEventSubscriber