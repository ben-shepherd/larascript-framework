import BaseProvider from "@src/core/base/Provider";
import QueueDriver, { QueueDriverOptions } from '@src/core/domains/events/drivers/QueueDriver';
import SynchronousDriver from "@src/core/domains/events/drivers/SynchronousDriver";
import { EventServiceConfig } from "@src/core/domains/events/interfaces/IEventService";
import EventService from "@src/core/domains/events/services/EventService";
import { default as DriverOptions } from '@src/core/domains/events/services/QueueDriverOptions';
import { App } from "@src/core/services/App";
import { TestListener } from "@src/tests/events/listeners/TestListener";
import { TestQueueListener } from "@src/tests/events/listeners/TestQueueListener";
import TestWorkerModel from "@src/tests/models/models/TestWorkerModel";

class TestEventProvider extends BaseProvider {
    async register(): Promise<void> {
        const config: EventServiceConfig = {
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

        App.setContainer('events', new EventService(config));
    }

    async boot(): Promise<void> { }
}

export default TestEventProvider