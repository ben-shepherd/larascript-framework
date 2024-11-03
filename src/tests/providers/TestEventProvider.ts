import { EVENT_DRIVERS } from '@src/config/events';
import QueueableDriver from '@src/core/domains/events/drivers/QueableDriver';
import SyncDriver from '@src/core/domains/events/drivers/SyncDriver';
import { IEventConfig } from '@src/core/domains/events/interfaces/config/IEventConfig';
import EventProvider from '@src/core/domains/events/providers/EventProvider';
import EventService from '@src/core/domains/events/services/EventService';
import TestListener from '@src/tests/events/listeners/TestListener';
import TestSubscriber from '@src/tests/events/subscribers/TestSubscriber';
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";

import TestEventQueueEvent from '../events/events/TestEventQueueEvent';
import TestEventSyncBadPayloadEvent from '../events/events/TestEventSyncBadPayloadEvent';
import TestEventSyncEvent from '../events/events/TestEventSyncEvent';

class TestEventProvider extends EventProvider {

    protected config: IEventConfig = {
        
        defaultDriver: SyncDriver,

        drivers: {
            [EVENT_DRIVERS.SYNC]: EventService.createConfig(SyncDriver, {}),
            [EVENT_DRIVERS.QUEABLE]: EventService.createConfig(QueueableDriver, {
                queueName: 'testQueue',
                retries: 3,
                failedCollection: 'testFailedWorkers',
                runAfterSeconds: 0,
                workerModelCtor: TestWorkerModel,
                runOnce: true
            })
        },

        events: [
            TestEventSyncEvent,
            TestEventSyncBadPayloadEvent,
            TestEventQueueEvent
        ],

        listeners: EventService.createListeners([
            {
                listener: TestListener,
                subscribers: [
                    TestSubscriber
                ]
            }
        ])
    }

}

export default TestEventProvider