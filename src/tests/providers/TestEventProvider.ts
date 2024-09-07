import QueueDriver, { QueueDriverOptions } from '@src/core/domains/events/drivers/QueueDriver';
import SynchronousDriver from "@src/core/domains/events/drivers/SynchronousDriver";
import { EventServiceConfig } from "@src/core/domains/events/interfaces/IEventService";
import EventProvider from "@src/core/domains/events/providers/EventProvider";
import { default as DriverOptions } from '@src/core/domains/events/services/QueueDriverOptions';
import { TestListener } from "@src/tests/events/listeners/TestListener";
import { TestQueueListener } from "@src/tests/events/listeners/TestQueueListener";
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