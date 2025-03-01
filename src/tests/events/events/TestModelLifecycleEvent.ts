import BaseEventListener from "@src/core/domains/events/base/BaseEventListener";
import { IModelAttributes } from "@src/core/domains/models/interfaces/IModel";

class TestModelLifecycleEvent extends BaseEventListener<IModelAttributes> {

    static readonly eventName = 'TestModelLifecycleEvent';

    protected namespace: string = 'testing';

    async handle(attributes: IModelAttributes): Promise<void> {
        // Handle the event
    }

}

export default TestModelLifecycleEvent; 