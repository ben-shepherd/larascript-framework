import QueueDriver, { QueueDriverOptions } from '@src/core/domains/events-legacy/drivers/QueueDriver';
import SynchronousDriver from "@src/core/domains/events-legacy/drivers/SynchronousDriver";
import { EventLegacyServiceConfig } from "@src/core/domains/events-legacy/interfaces/IEventService";
import EventLegacyProvider from "@src/core/domains/events-legacy/providers/EventLegacyProvider";
import { default as DriverOptions } from '@src/core/domains/events-legacy/services/QueueDriverOptions';
import { TestListener } from "@src/tests/events/listeners/TestListenerLegacy";
import { TestQueueListenerLegacy } from "@src/tests/events/listeners/TestQueueListenerLegacy";
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";

class TestEventProvider extends EventLegacyProvider {

    protected config: EventLegacyServiceConfig = {
        defaultDriver: 'sync',
        drivers: {
            testing: {
                driverCtor: QueueDriver,
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
                driverCtor: SynchronousDriver
            }
        },
        subscribers: {
            'TestQueueEvent': [
                TestQueueListenerLegacy
            ],
            'TestEvent': [
                TestListener
            ]
        }
    }

}

export default TestEventProvider