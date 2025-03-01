import { EVENT_DRIVERS } from '@src/config/events.config';
import QueueableDriver, { TQueueDriverOptions } from '@src/core/domains/events/drivers/QueableDriver';
import SyncDriver from '@src/core/domains/events/drivers/SyncDriver';
import { IEventConfig } from '@src/core/domains/events/interfaces/config/IEventConfig';
import EventProvider from '@src/core/domains/events/providers/EventProvider';
import EventService from '@src/core/domains/events/services/EventService';
import TestFailedWorkerModel from '@src/tests/models/models/TestFailedWorkerModel';
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";

import TestUserCreatedListener from '../events/events/auth/TestUserCreatedListener';
import TestUserCreatedSubscriber from '../events/events/auth/TestUserCreatedSubscriber';

class TestEventProvider extends EventProvider {

    protected config: IEventConfig = {
        
        defaultDriver: SyncDriver,

        drivers: {
            [EVENT_DRIVERS.SYNC]: EventService.createConfigDriver(SyncDriver, {}),
            [EVENT_DRIVERS.QUEABLE]: EventService.createConfigDriver<TQueueDriverOptions>(QueueableDriver, {
                queueName: 'testQueue',
                retries: 3,
                runAfterSeconds: 0,
                failedWorkerModelCtor: TestFailedWorkerModel,
                workerModelCtor: TestWorkerModel,
                runOnce: true
            })
        },

        listeners: [
            {
                listener: TestUserCreatedListener,
                subscribers: [TestUserCreatedSubscriber]
            }
        ]
    }

}

export default TestEventProvider