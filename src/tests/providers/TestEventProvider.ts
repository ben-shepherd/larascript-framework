import QueueDriver, { QueueDriverOptions } from '@src/core/domains/events-legacy/drivers/QueueDriver';
import SynchronousDriver from "@src/core/domains/events-legacy/drivers/SynchronousDriver";
import { EventServiceConfig } from "@src/core/domains/events-legacy/interfaces/IEventService";
import EventProvider from "@src/core/domains/events-legacy/providers/EventProvider";
import { default as DriverOptions } from '@src/core/domains/events-legacy/services/QueueDriverOptions';
import { TestListener } from "@src/tests/events/listeners/TestListenerLegacy";
import { TestQueueListener } from "@src/tests/events/listeners/TestQueueListenerLegacy";
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";

class TestEventProvider extends EventProvider {

    protected config: EventServiceConfig = {
        defaultDriver: 'sync',
        drivers: {
            testing: {
                driver: QueueDriver,
                options: new DriverOptions<QueueDriverOptions>({
                    queueName: 'testQueue',
                    retries: 3,
                    failedCollection: 'testFailedWorkers',
                    runAfterSeconds: 0,
                    workerModelCtor: TestWorkerModel,
                    runOnce: true
                })
            },
            sync: {
                driver: SynchronousDriver
            }
        },
        subscribers: {
            'TestQueueEvent': [
                TestQueueListener
            ],
            'TestEvent': [
                TestListener
            ]
        }
    }

}

export default TestEventProvider